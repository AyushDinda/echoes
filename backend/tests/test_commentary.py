def test_commentary_generation_mock(client):
    # Create session
    create_resp = client.post("/api/sessions", json={"title": "Test Terminal", "atmosphere": "creepy"})
    session_id = create_resp.json()["id"]

    # Submit command
    cmd_resp = client.post(
        f"/api/sessions/{session_id}/comment",
        json={"command": "git status", "atmosphere": "creepy"}
    )
    assert cmd_resp.status_code == 200
    data = cmd_resp.json()
    assert data["session_id"] == session_id
    assert data["command"] == "git status"
    assert len(data["commentary"]) > 10
    assert data["is_mock"] is True

    # Verify entry persists in session
    session_resp = client.get(f"/api/sessions/{session_id}")
    entries = session_resp.json()["entries"]
    assert len(entries) == 1
    assert entries[0]["command_text"] == "git status"

def test_commentary_empty_command_rejected(client):
    create_resp = client.post("/api/sessions", json={"title": "Test", "atmosphere": "subtle"})
    session_id = create_resp.json()["id"]

    # Empty string
    empty_resp = client.post(
        f"/api/sessions/{session_id}/comment",
        json={"command": ""}
    )
    assert empty_resp.status_code == 422

    # Whitespace only
    ws_resp = client.post(
        f"/api/sessions/{session_id}/comment",
        json={"command": "     "}
    )
    assert ws_resp.status_code == 422

def test_commentary_oversized_command_rejected(client):
    create_resp = client.post("/api/sessions", json={"title": "Test", "atmosphere": "subtle"})
    session_id = create_resp.json()["id"]

    # Exceeds max length of 500 characters
    long_cmd = "echo " + ("A" * 505)
    resp = client.post(
        f"/api/sessions/{session_id}/comment",
        json={"command": long_cmd}
    )
    assert resp.status_code == 422
