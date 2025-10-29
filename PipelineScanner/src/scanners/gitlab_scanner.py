import logging
import re
from typing import Dict, List

import yaml


logger = logging.getLogger(__name__)


class GitLabScanner:
    def __init__(self):
        self.checks = [
            self.check_hardcoded_secrets,
            self.check_unsafe_permissions,
            self.check_outdated_images,
            self.check_missing_security_scans
        ]

    def scan_pipeline(self, pipeline_content: str, pipeline_name: str = "unknown") -> Dict:
        """Scan GitLab CI pipeline for security issues"""
        try:
            pipeline = yaml.safe_load(pipeline_content)
        except yaml.YAMLError as e:
            return {
                "pipeline_name": pipeline_name,
                "error": f"Invalid YAML: {str(e)}",
                "findings": [],
                "risk_score": 0,
                "scan_success": False
            }

        findings = []
        for check in self.checks:
            try:
                findings.extend(check(pipeline))
            except Exception as e:
                logger.error(f"Check {check.__name__} failed: {str(e)}")

        risk_score = self.calculate_risk_score(findings)

        return {
            "pipeline_name": pipeline_name,
            "findings": findings,
            "risk_score": risk_score,
            "scan_success": True,
            "total_findings": len(findings),
            "high_priority_findings": len([f for f in findings if f["severity"] == "HIGH"])
        }

    def check_hardcoded_secrets(self, pipeline: Dict) -> List[Dict]:
        """Check for hardcoded secrets in pipeline"""
        findings = []
        pipeline_yaml = yaml.dump(pipeline)

        secret_patterns = {
            r'password\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded password detected",
            r'token\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded token detected",
            r'secret\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded secret detected",
            r'api[_-]?key\s*:\s*["\']?[^"\'\s]{8,}["\']?': "Hardcoded API key detected",
        }

        lines = pipeline_yaml.split('/')
        for line_num, line in enumerate(lines, 1):
            for pattern, description in secret_patterns.items():
                if re.search(pattern, line, re.IGNORECASE):
                    if any(false_positive in line.lower() for false_positive in ['example', 'placeholder', 'xxx', 'your_']):
                        continue

                    findings.append({
                        "type": "HARDCODED_SECRET",
                        "severity": "HIGH",
                        "description": description,
                        "line_number": line_num,
                        "remediation": "Use GitLab CI Variables for sensitive values"
                    })

        return findings

    def check_unsafe_permissions(self, pipeline: Dict) -> List[Dict]:
        """Check for unsafe pipeline configurations"""
        findings = []

        # Check for allow_failure on important jobs
        for job_name, job_config in pipeline.items():
            if job_name.startswith('.'):
                continue  # Skip hidden jobs

            if job_config.get('allow_failure', False):
                # If it's a security-related job, this is bad
                if any(security_term in job_name.lower() for security_term in ['security', 'scan', 'test', 'audit']):
                    findings.append({
                        "type": "UNSAFE_ALLOW_FAILURE",
                        "severity": "MEDIUM",
                        "description": f"Security job '{job_name}' allows failure",
                        "remediation": "Set allow_failure: false for security jobs"
                    })

        return findings

    def check_outdated_images(self, pipeline: Dict) -> List[Dict]:
        """Check for outdated container images"""
        findings = []

        for job_name, job_config in pipeline.items():
            if job_name.startswith('.'):
                continue

            image = job_config.get('image')
            if image:
                # Check for old versions or latest tag
                if image.endswith(':latest') or ':latest' in image:
                    findings.append({
                        "type": "LATEST_TAG",
                        "severity": "MEDIUM",
                        "description": f"Job '{job_name}' uses 'latest' tag",
                        "remediation": "Use specific version tags for container images"
                    })

        return findings

    def check_missing_security_scans(self, pipeline: Dict) -> List[Dict]:
        """Check if security scanning stages are missing"""
        findings = []

        pipeline_yaml = yaml.dump(pipeline).lower()
        security_tools = ['bandit', 'safety',
                          'trivy', 'grype', 'snyk', 'semgrep']

        has_security_scan = any(
            tool in pipeline_yaml for tool in security_tools)

        if not has_security_scan:
            findings.append({
                "type": "MISSING_SECURITY_SCAN",
                "severity": "MEDIUM",
                "description": "No security scanning stages detected",
                "remediation": "Add security scanning to your pipeline"
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
