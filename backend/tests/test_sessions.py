def test_session_lifecycle(client):
    # 1. Create a session
    create_resp = client.post("/api/sessions", json={"title": "Midnight Debugging", "atmosphere": "gothic"})
    assert create_resp.status_code == 201
    session_data = create_resp.json()
    session_id = session_data["id"]
    assert session_data["title"] == "Midnight Debugging"
    assert session_data["atmosphere"] == "gothic"
    assert session_data["entries"] == []

    # 2. Retrieve session
    get_resp = client.get(f"/api/sessions/{session_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == session_id

    # 3. List sessions
    list_resp = client.get("/api/sessions")
    assert list_resp.status_code == 200
    items = list_resp.json()
    assert any(s["id"] == session_id for s in items)

    # 4. Clear session history
    clear_resp = client.delete(f"/api/sessions/{session_id}/history")
    assert clear_resp.status_code == 200
    assert "cleared" in clear_resp.json()["message"]

    # 5. Delete session
    del_resp = client.delete(f"/api/sessions/{session_id}")
    assert del_resp.status_code == 200

    # 6. Verify 404 after deletion
    not_found_resp = client.get(f"/api/sessions/{session_id}")
    assert not_found_resp.status_code == 404

def test_session_not_found(client):
    resp = client.get("/api/sessions/non-existent-uuid")
    assert resp.status_code == 404
