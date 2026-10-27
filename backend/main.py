import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load local environment if .env exists
load_dotenv()

from backend.database.connection import init_db
from backend.api.routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database schema
    init_db()
    yield

app = FastAPI(
    title="Echoes: The Ghost in Your Terminal",
    description="A retro-terminal AI companion providing eerie commentary on simulated developer commands.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler to prevent leaking raw tracebacks
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log internally without leaking stack trace to user
    return JSONResponse(
        status_code=500,
        content={"detail": "An anomaly occurred in the terminal stream. The ghost refused connection."}
    )

# Include API routes
app.include_router(router)

@app.get("/")
async def root():
    return {
        "app": "Echoes: The Ghost in Your Terminal",
        "mode": "Simulated Terminal Environment",
        "safety": "Commands are parsed as untrusted text and are NEVER executed by the operating system.",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
