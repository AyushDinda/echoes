def test_story_generation_mock(client):
    create_resp = client.post("/api/sessions", json={"title": "Haunted Repo", "atmosphere": "gothic"})
    session_id = create_resp.json()["id"]

    # Add a couple of commands
    client.post(f"/api/sessions/{session_id}/comment", json={"command": "npm run build"})
    client.post(f"/api/sessions/{session_id}/comment", json={"command": "docker compose up"})

    # Generate story from session commands
    story_resp = client.post(
        f"/api/sessions/{session_id}/story",
        json={
            "length": "medium",
            "atmosphere": "gothic",
            "inspiration_type": "session",
            "ending_style": "twist"
        }
    )
    assert story_resp.status_code == 200
    story_data = story_resp.json()
    assert story_data["session_id"] == session_id
    assert len(story_data["title"]) > 3
    assert len(story_data["narrative"]) > 100
    assert story_data["ending_style"] == "twist"
    assert story_data["is_mock"] is True

    # Verify story shows up in session detail
    session_detail = client.get(f"/api/sessions/{session_id}").json()
    assert len(session_detail["stories"]) == 1
    assert session_detail["stories"][0]["id"] == story_data["id"]

def test_story_generation_custom_theme(client):
    create_resp = client.post("/api/sessions", json={"title": "Custom Theme", "atmosphere": "full_horror"})
    session_id = create_resp.json()["id"]

    story_resp = client.post(
        f"/api/sessions/{session_id}/story",
        json={
            "length": "short",
            "atmosphere": "full_horror",
            "inspiration_type": "custom",
            "custom_theme": "The recursive mirror in the graphics pipeline",
            "ending_style": "ambiguous"
        }
    )
    assert story_resp.status_code == 200
    story_data = story_resp.json()
    assert "narrative" in story_data
    assert story_data["length"] == "short"
