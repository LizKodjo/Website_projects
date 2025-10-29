import json
import logging
import re
from typing import Dict, List, Optional
import yaml

logger = logging.getLogger(__name__)


class GitHubActionsScanner:
    def __init__(self):
        self.checks = [
            self.check_hardcoded_secrets,
            self.check_unsafe_permissions,
            self.check_outdated_actions,
            self.check_missing_security_scans,
            self.check_unsafe_script_injections,
            self.check_self_hosted_runners,
            self.check_artifact_retention
        ]

    def scan_workflow(self, workflow_content: str, workflow_name: str = "unknown") -> Dict:
        """Scan GitHub Actions workflow for security issues"""
        try:
            workflow = yaml.safe_load(workflow_content)
        except yaml.YAMLError as e:
            return {
                "workflow_name": workflow_name,
                "error": f"Invalid YAML: {str(e)}",
                "findings": [],
                "risk_score": 0,
                "scan_success": False
            }

        findings = []
        for check in self.checks:
            try:
                findings.extend(check(workflow))
            except Exception as e:
                logger.error(f"Check {check.__name__} failed: {str(e)}")
                findings.append({
                    "type": "SCANNER_ERROR",
                    "severity": "MEDIUM",
                    "description": f"Scanner check failed: {check.__name__}",
                    "line_number": None,
                    "remediation": "Check scanner implementation"
                })
        risk_score = self.calculate_risk_score(findings)
        return {
            "workflow_name": workflow_name,
            "findings": findings,
            "risk_score": risk_score,
            "scan_success": True,
            "total_findings": len(findings),
            "high_priority_findings": len([f for f in findings if f["severity"] == "HIGH"])
        }

    def scan_github_actions(self, workflow_content: str) -> Dict:
        """Scan GitHub Actions workflow for security issues"""
        try:
            workflow = yaml.safe_load(workflow_content)
        except yaml.YAMLError as e:
            return {"error": f"Invalid YAML: {str(e)}"}

        findings = []
        for check in self.checks:
            findings.extend(check(workflow))

        return {
            "workflow_name": workflow.get('name', 'unknown'),
            "findings": findings,
            "risk_score": self.calculate_risk_score(findings)
        }

    def check_hardcoded_secrets(self, workflow: Dict) -> List[Dict]:
        """Check for hardcoded secrets in workflow"""
        findings = []
        workflow_yaml = yaml.dump(workflow)

        # Common secret patterns
        secret_patterns = {
            r'password\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded password detected",
            r'token\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded token detected",
            r'secret\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded secret detected",
            r'api[_-]?key\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded API key detected",
            r'aws[_-]?access[_-]?key\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded AWS access key",
            r'aws[_-]?secret[_-]?key\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded AWS secret key",
        }

        lines = workflow_yaml.split('\n')
        for line_num, line in enumerate(lines, 1):
            for pattern, description in secret_patterns.items():
                if re.search(pattern, line, re.IGNORECASE):
                    # Skip common false positives
                    if any(false_positive in line.lower() for false_positive in ['example', 'placeholder', 'xxx', 'your_']):
                        continue

                    findings.append({
                        "type": "HARDCODED_SECRET",
                        "severity": "HIGH",
                        "description": description,
                        "line_number": line_num,
                        "line_content": line.strip(),
                        "remediation": "Use GitHub Secrets ({{ secrets.SECRET_NAME }}) for sensitive values"
                    })

        return findings

    def check_unsafe_permissions(self, workflow: Dict) -> List[Dict]:
        """Check for overly permissive permissions"""
        findings = []

        # Check top-level permissions
        permissions = workflow.get('permissions', {})
        if permissions == 'write-all':
            findings.append({
                "type": "OVERLY_PERMISSIVE",
                "severity": "HIGH",
                "description": "Workflow has write-all permissions",
                "line_number": self.find_line_number(workflow, 'permissions'),
                "remediation": "Set minimum required permissions instead of 'write-all'"
            })

        # Check job-level permissions
        for job_name, job_config in workflow.get('jobs', {}).items():
            job_permissions = job_config.get('permissions', {})
            if job_permissions == 'write-all':
                findings.append({
                    "type": "OVERLY_PERMISSIVE",
                    "severity": "HIGH",
                    "description": f"Job '{job_name}' has write-all permissions",
                    "line_number": self.find_line_number(job_config, 'permissions'),
                    "remediation": "Set minimum required permissions for each job"
                })

        return findings

    def check_outdated_actions(self, workflow: Dict) -> List[Dict]:
        """Check for outdated GitHub Actions"""
        findings = []

        # Known vulnerable or deprecated actions
        outdated_actions = {
            'actions/checkout@v1': 'v2 or later',
            'actions/setup-node@v1': 'v2 or later',
            'actions/upload-artifact@v1': 'v2 or later',
            'actions/download-artifact@v1': 'v2 or later',
        }

        for job_name, job_config in workflow.get('jobs', {}).items():
            for step in job_config.get('steps', []):
                uses = step.get('uses', '')
                if uses in outdated_actions:
                    findings.append({
                        "type": "OUTDATED_ACTION",
                        "severity": "MEDIUM",
                        "description": f"Using outdated action: {uses}",
                        "line_number": self.find_line_number(step, 'uses'),
                        "remediation": f"Update to {outdated_actions[uses]}"
                    })

        return findings

    def check_missing_security_scans(self, workflow: Dict) -> List[Dict]:
        """Check if security scanning steps are missing"""
        findings = []

        has_security_scan = False
        workflow_yaml = yaml.dump(workflow).lower()

        # Common security scanning tools
        security_tools = ['bandit', 'safety',
                          'trivy', 'grype', 'snyk', 'semgrep']

        for tool in security_tools:
            if tool in workflow_yaml:
                has_security_scan = True
                break

        if not has_security_scan:
            findings.append({
                "type": "MISSING_SECURITY_SCAN",
                "severity": "MEDIUM",
                "description": "No security scanning steps detected in workflow",
                "line_number": None,
                "remediation": "Add security scanning steps (SAST, SCA) to your CI/CD pipeline"
            })

        return findings

    def check_unsafe_script_injections(self, workflow: Dict) -> List[Dict]:
        """Check for unsafe script injections"""
        findings = []

        for job_name, job_config in workflow.get('jobs', {}).items():
            for step in job_config.get('steps', []):
                run_content = step.get('run', '')
                if 'curl' in run_content and '| sh' in run_content:
                    findings.append({
                        "type": "UNSAFE_SCRIPT_INJECTION",
                        "severity": "HIGH",
                        "description": "Unsafe script injection detected (curl | sh)",
                        "line_number": self.find_line_number(step, 'run'),
                        "remediation": "Download scripts, verify checksums, then execute"
                    })

        return findings

    def check_self_hosted_runners(self, workflow: Dict) -> List[Dict]:
        """Check for self-hosted runners without proper security"""
        findings = []

        for job_name, job_config in workflow.get('jobs', {}).items():
            runs_on = job_config.get('runs-on', '')
            if 'self-hosted' in str(runs_on):
                findings.append({
                    "type": "SELF_HOSTED_RUNNER",
                    "severity": "MEDIUM",
                    "description": "Using self-hosted runner without additional security checks",
                    "line_number": self.find_line_number(job_config, 'runs-on'),
                    "remediation": "Ensure self-hosted runners are properly secured and monitored"
                })

        return findings

    def check_artifact_retention(self, workflow: Dict) -> List[Dict]:
        """Check for sensitive artifact retention issues"""
        findings = []

        workflow_yaml = yaml.dump(workflow)
        if 'actions/upload-artifact' in workflow_yaml and 'actions/upload-artifact@v1' in workflow_yaml:
            findings.append({
                "type": "ARTIFACT_RETENTION",
                "severity": "LOW",
                "description": "Using v1 of upload-artifact which has different retention",
                "line_number": None,
                "remediation": "Update to actions/upload-artifact@v3 for better control"
            })

        return findings

    def calculate_risk_score(self, findings: List[Dict]) -> int:
        """Calculate overall risk score (0-100)"""
        severity_weights = {
            "HIGH": 10,
            "MEDIUM": 5,
            "LOW": 1
        }

        score = 0
        for finding in findings:
            score += severity_weights.get(finding["severity"], 0)

        return min(score, 100)

    def find_line_number(self, obj: Dict, key: str) -> Optional[int]:
        """Helper to find approximate line number (simplified)"""
        # In a real implementation, you'd use a YAML parser that preserves line numbers
        return None
