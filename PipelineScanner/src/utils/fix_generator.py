import re
import yaml
from typing import Optional


class FixGenerator:
    def __init__(self) -> None:
        self.fix_templates = {
            "HARDCODED_SECRET": self.fix_hardcoded_secret,
            "OVERLY_PERMISSIVE": self.fix_overly_permissive,
            "OUTDATED_ACTION": self.fix_outdated_action,
            "LATEST_TAG": self.fix_latest_tag,
        }

    def generate_fix(self, finding_type: str, config_content: str, platform: str) -> str:
        """Generate fix for a specific finding type"""
        if finding_type in self.fix_templates:
            return self.fix_templates[finding_type](config_content, platform)
        else:
            return config_content       # Return original if no fix template

    def fix_hardcoded_secret(self, config_content: str, platform: str) -> str:
        """Replace hardcoded secrets with variable reference"""
        fixed_content = config_content

        # Pattern to find common secret assignments
        patterns = {
            r'password\s*:\s*["\']([^"\']+)["\']': 'password: ${{ secrets.PASSWORD }}',
            r'token\s*:\s*["\']([^"\']+)["\']': 'token: ${{ secrets.TOKEN }}',
            r'api[_-]?key\s*:\s*["\']([^"\']+)["\']': 'api_key: ${{ secrets.API_KEY }}',
        }

        for pattern, replacement in patterns.items():
            fixed_content = re.sub(pattern, replacement,
                                   fixed_content, flags=re.IGNORECASE)
        return fixed_content

    def fix_overly_permissive(self, config_content: str, platform: str) -> str:
        """Fix overly permissive permissions"""
        if platform == "github":
            # Replace write-all with read-only by default
            fixed_content = config_content.replace(
                "permissions: write-all", "permissions: read-all")
            fixed_content = fixed_content.replace("'write-all'", "'read-all'")
            fixed_content = fixed_content.replace('"write-all"', '"read-all"')
        return fixed_content

    def fix_outdated_action(self, config_content: str, platform: str) -> str:
        """Update outdated GitHub Actions"""
        action_updates = {
            'actions/checkout@v1': 'actions/checkout@v4',
            'actions/checkoout@v2': 'actions/checkout@v4',
            'actions/setup-node@v1': 'actions/setup-node@v4',
            'actions/upload-artifact@v1': 'actions/upload-artifact@v4',
            'actions/download-artifact@v1': 'actions/download-artifact@v4',
        }

        fixed_content = config_content
        for old, new in action_updates.items():
            fixed_content = fixed_content.replace(old, new)

        return fixed_content

    def fix_latest_tag(self, config_content: str, platform: str) -> str:
        """Replace latest tags with specific versions"""
        fixed_content = config_content

        # Replace latest with specific version(example)
        fixed_content = re.sub(
            r'image:\s*([^:\s]+):latest',
            r'image: \1:stable',
            fixed_content
        )

        return fixed_content
