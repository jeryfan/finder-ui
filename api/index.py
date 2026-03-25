"""
Vercel Serverless Function entry point for the FastAPI backend.
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

# Create ASGI handler
_asgi_handler = Mangum(app, lifespan="off")


def handler(event, context):
    """Vercel serverless function handler."""
    return _asgi_handler(event, context)


# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
