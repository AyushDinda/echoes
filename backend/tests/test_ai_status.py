from backend.services.ai_service import ai_service

def test_ai_status_mock_mode(client):
    response = client.get("/api/ai/status")
    assert response.status_code == 200
    data = response.json()
    assert data["connected"] is True
    assert data["mock_mode"] is True
    assert "Mock Mode" in data["model"]
    assert "mock" in data["message"].lower()

def test_ai_status_disconnected(client, monkeypatch):
    # Temporarily force mock_mode to False to test unreachable Ollama
    monkeypatch.setattr(ai_service, "mock_mode", False)
    monkeypatch.setattr(ai_service, "base_url", "http://127.0.0.1:59999")

    response = client.get("/api/ai/status")
    assert response.status_code == 200
    data = response.json()
    assert data["connected"] is False
    assert data["mock_mode"] is False
    assert "The local ghost is unavailable" in data["message"]
