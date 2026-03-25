"""
Vercel Serverless Function - FastAPI ASGI entry point.
Uses Mangum to wrap FastAPI for ASGI compatibility.
"""

import sys
import os

# Add server directory to Python path
_server_dir = os.path.join(os.path.dirname(__file__), '..', 'server')
sys.path.insert(0, _server_dir)

# Import FastAPI app
from main import app as _app
from mangum import Mangum as _Mangum

# Create ASGI handler instance
_asgi_handler = _Mangum(_app, lifespan="off")

# Export handler function for Vercel
def handler(request, context):
    """ASGI handler for Vercel serverless function."""
    return _asgi_handler(request, context)

# Control what gets exported - only 'handler'
__all__ = ['handler']
