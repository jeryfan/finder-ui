"""
Vercel Serverless Function entry point for the FastAPI backend.
This file proxies requests to the FastAPI app in the server directory.
"""

import sys
import os

# Add server directory to path
server_dir = os.path.join(os.path.dirname(__file__), '..', 'server')
sys.path.insert(0, server_dir)

# Import the FastAPI app
from main import app

# Import mangum for ASGI wrapper
from mangum import Mangum

# Vercel expects a handler function
handler = Mangum(app, lifespan="off")

# app variable is also needed for Vercel
__all__ = ['handler', 'app']
