#!/usr/bin/env python3
"""
Test runner script for URL Shortener
"""
import pytest
import sys

if __name__ == '__main__':
    # Run pytest with arguments
    args = sys.argv[1:] if len(sys.argv) > 1 else ['-v', '--tb=short']

    print("Running URL Shortener tests...")
    exit_code = pytest.main(args)
    sys.exit(exit_code)
