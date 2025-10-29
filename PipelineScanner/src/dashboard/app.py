from typing import Any, Dict
import requests
import streamlit as st
import json
import time

# Page configurations
st.set_page_config(
    page_title="CI/CD Security Scanner",
    page_icon="🔒",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
            <style>
            .main-header {
                font-size: 3rem;
                color: #1f77b4;
                text-align: center;
                margin-bottom: 2rem;
            }
            .risk-high {
                background-color: #ff4b4b;
                color: white;
                padding: 0.5rem;
                border-radius: 0.5rem;
            }
            .risk-medium {
                background-color: #ffa500;
                color: white,
                padding: 0.5rem;
                border-radius: 0.5rem;
            }
            
            .risk-low {
                background-color: #00cc96;
                color: white;
                padding: 0.5rem;
                border-radius: 0.5rem;
            }
            .finding-card{
                border-left: 4px solid #1f77b4;
                padding: 1rem;
                margin: 0.5rem 0;
                background-color: #f0f2f6;
            }
            </style>
            """, unsafe_allow_html=True)


class CICDSecurityScanner:
    def __init__(self, api_url: str = "http://localhost:8000"):
        self.api_url = api_url

    def scan_configuration(self, platform: str, config_content: str, config_name: str) -> Dict[str, Any]:
        """Scan CI/CD configuration"""

        try:
            response = requests.post(
                f"{self.api_url}/scan",
                json={
                    "platform": platform,
                    "config_content": config_content,
                    "config_name": config_name
                },
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            st.error(f"Error connecting to API: {str(e)}")

            return {}

    def generate_fix(self, finding_type: str, config_content: str, platform; str) -> str:
        """Generate fox for finding"""
        try:
            response = requests.post(
                f"{self.api_url}/generate-fix",
                json={
                    "finding_type": finding_type,
                    "config_content": config_content,
                    "platform": platform
                },
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("fixed_config", config_content)

        except requests.exceptions.RequestException as e:
            st.error(f"Error generating fix: {str(e)}")
            return config_content


def main():
    # Initialise scanner
    scanner = CICDSecurityScanner()

    # Header
    st.markdown('<h1 class="main-header">🔒 CI/CD Security Scanner</h1>',
                unsafe_allow_html=True)
    st.markdown(
        "Scan your CI/CD configurations for security misconfiguration and get automated fees.")

    # Sidebar
    st.sidebar.title("Configuration")
    platform = st.sidebar.selectbox(
        "Select CI/CD Platform",
        ["github", "gitlab"],
        help="Choose the platform for your CI/CD configuration"
    )

    st.sidebar.markdown("---")
    st.sidebar.markdown("### About")
    st.sidebar.info(
        "This tool scans CI/CD configurations for security issues like hardcoded secrets, "
        "overly permissive permissions, outdated actions, and missing security scans."
    )

    # Main content
    col1, col2 = st.columns([1, 1])

    with col1:
        st.subheader("Input Configuration")
        config_name = st.text_input(
            "Configuration Name", value="my-workflow", help="Name for your configuration")

        config_content = st.text_area(
            f"Paste your {platform.upper()} CI/CD configuration",
            height=400,
            placeholder=f"Paste your {platform} workflow/pipeline YAML here...",
            help="Paste your complete CI/CD configuration file content"
        )

        if st.button("🔍 Scan Configuration", type="primary", use_container_width=True):
            if config_content.strip():
                with st.spinner("Scanning for security issues..."):
                    results = scanner.scan_configuration(
                        platform, config_content, config_name)

                    if results:
                        # Store results in session state
                        st.session_state.scan_results = results
                        st.session_state.config_content = config_content
                        st.session_state.platform = platform
            else:
                st.warning("Please enter a configuration to scan")

    with col2:
        st.subheader("Scan Results")

        if 'scan_results' in st.session_state:
            results = st.session_state.scan_results

            if not results.get('scan_success', False):
                st.error(
                    f"Scan failed: {results.get('error', 'Unknown error')}")
                return

            # Risk score and summary
            risk_score = results.get('risk_score', 0)
            col21, col22, col23 = st.columns(3)

            with col21:
                if risk_score >= 70:
                    st.markdown(
                        f'<div class="risk-high">Risk Score: {risk_score}/100</div>', unsafe_allow_html=True)
                elif risk_score >= 40:
                    st.markdown(
                        f'<div class="risk-medium">Risk Score: {risk_score}/100</div>', unsafe_allow_html=True)
                else:
                    st.markdown(
                        f'<div class="risk-low">Risk Score: {risk_score}/100</div>', unsafe_allow_html=True)

            with col22:
                st.metric("Total Findings", results.get('total_findings', 0))

            with col23:
                st.metric("High Priority", results.get(
                    'high_priority_findings', 0))

            # Findings details
            st.markdown("### Security Findings")

            findings = results.get('findings', [])
            if not findings:
                st.success(
                    "🎉 No security issues found! Your configuration looks secure.")
            else:
                # Group by severity
                high_findings = [
                    f for f in findings if f['severity'] == 'HIGH']
                medium_findings = [
                    f for f in findings if f['severity'] == 'MEDIUM']
                low_findings = [f for f in findings if f['severity'] == 'LOW']

                for severity_group, group_name in [
                    (high_findings, "🔴 High Severity"),
                    (medium_findings, "🟡 Medium Severity"),
                    (low_findings, "🟢 Low Severity")
                ]:
                    if severity_group:
                        st.markdown(
                            f"#### {group_name} ({len(severity_group)})")

                        for finding in severity_group:
                            with st.expander(f"{finding['type']} - Line {finding.get('line_number', 'N/A')}"):
                                st.write(
                                    f"**Description**: {finding['description']}")
                                st.write(
                                    f"**Remediation**: {finding['remediation']}")

                                # Show fix generation option for some finding types
                                if finding['type'] in ['HARDCODED_SECRET', 'OUTDATED_ACTION', 'LATEST_TAG']:
                                    if st.button(f"Generate Fix", key=f"fix_{finding['type']}_{hash(str(finding))}"):
                                        fixed_config = scanner.generate_fix(
                                            finding['type'],
                                            st.session_state.config_content,
                                            st.session_state.platform
                                        )
                                        st.session_state.fixed_config = fixed_config
                                        st.session_state.show_fixes = True

                # Show fixed configuration if available
                if st.session_state.get('show_fixes', False) and 'fixed_config' in st.session_state:
                    st.markdown("### Fixed Configuration")
                    st.code(st.session_state.fixed_config, language="yaml")

                    st.download_button(
                        label="Download Fixed Config",
                        data=st.session_state.fixed_config,
                        file_name=f"fixed-{config_name}.yml",
                        mime="text/yaml"
                    )
        else:
            st.info(
                "👆 Enter a configuration and click 'Scan Configuration' to see results")

    # Examples section
    st.markdown("---")
    st.subheader("Example Configurations")

    col3, col4 = st.columns(2)

    with col3:
        st.markdown("#### GitHub Actions Example")
        github_example = """name: Security Scan
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Bandit Security Scan
        run: |
          pip install bandit
          bandit -r . -f json
          
      - name: Run Safety Check
        run: |
          pip install safety
          safety check --json"""

        st.code(github_example, language="yaml")

    with col4:
        st.markdown("#### GitLab CI Example")
        gitlab_example = """stages:
  - security_scan

bandit-scan:
  stage: security_scan
  image: python:3.9
  script:
    - pip install bandit
    - bandit -r . -f json
  artifacts:
    paths:
      - bandit-report.json

safety-scan:
  stage: security_scan
  image: python:3.9
  script:
    - pip install safety
    - safety check --json"""

        st.code(gitlab_example, language="yaml")


if __name__ == "__main__":
    main()
