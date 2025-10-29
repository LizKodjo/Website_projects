import logging
from typing import Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.scanners.github_actions_scanner import GitHubActionsScanner
from src.scanners.gitlab_scanner import GitLabScanner
from src.utils.fix_generator import FixGenerator


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CI/CD Security Scanner API",
              description="A security scanner for CI/CD pipeline configuration", version="1.0.0")

# CORS middleware
app.add_middleware(CORSMiddleware, allow_origins=[
                   "*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)

# Initialise scanners
github_scanner = GitHubActionsScanner()
gitlab_scanner = GitLabScanner()
fix_generator = FixGenerator()


class ScanRequest(BaseModel):
    platform: str
    config_content: str
    config_name: Optional[str] = "unknown"


class FixRequest(BaseModel):
    status: str
    version: str


@app.get("/", response_model=Dict[str, str])
async def roo():
    return {"message": "CI/CD Security Scanner API", "version": "1.0.0"}


@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="healthy", version="1.0.0")


@app.post("/scan")
async def scan_configuration(request: ScanRequest):
    """Scan CI/CD configuration for security issues"""
    try:
        logger.info(
            f"Scanning {request.platform} configuration: {request.config_name}")

        if request.platform == 'github':
            results = github_scanner.scan_workflow(
                request.config_content,
                request.config_name
            )
        elif request.platform == 'gitlab':
            results = gitlab_scanner.scan_pipeline(
                request.config_content,
                request.config_name
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported platform: {request.platform}.  Supported: github, gitlab"
            )
        return results

    except Exception as e:
        logger.error(f"Scan failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")


@app.post("/generae-fix")
async def generate_fix(request: FixRequest):
    """Generate automated fix for security finding"""
    try:
        logger.info(
            f"Generating fix for {request.finding_type} on {request.platform}")

        fixed_config = fix_generator.generate_fix(
            request.finding_type,
            request.config_content,
            request.platform
        )

        return {
            "finding_type": request.finding_type,
            "original_config": request.config_content,
            "fixed_config": fixed_config,
            "platform": request.platform
        }

    except Exception as e:
        logger.error(f"Fix generation faile: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Fix generation failed: {str(e)}")


@app.get("/supported-platforms")
async def get_supported_platforms():
    """Get list of supported CI/CD platforms"""

    return {
        "platforms": [
            {
                "name": "github",
                "description": "GitHub Actions workflows",
                "file_extensions": [".yml", ".yaml"]
            },
            {
                "name": "gitlab",
                "description": "GitLab CI pipeline",
                "file_extensions": [".yml", ".yaml"]
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
