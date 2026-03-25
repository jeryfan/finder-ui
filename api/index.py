"""
Vercel Serverless Function entry point for the FastAPI backend.
This file proxies requests to the FastAPI app in the server directory.
"""

import sys
import os

# Add server directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))

# Import the FastAPI app
from main import app

# Vercel expects a handler function
from mangum import Mangum

# Create ASGI handler for Vercel
handler = Mangum(app, lifespan="off")

# For local development, you can still run: uv run uvicorn main:app --reload
# from the server/ directory
