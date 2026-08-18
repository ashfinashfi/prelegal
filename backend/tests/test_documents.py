"""Document management endpoint tests."""

def test_document_lifecycle(client):
    # 1. Sign up user
    signup_res = client.post(
        "/api/auth/signup",
        json={"email": "docs@example.com", "password": "securepassword123"},
    )
    assert signup_res.status_code == 200

    # 2. Save new document
    sample_doc = {
        "document_type": "mutual_nda",
        "title": "Acme - Beta NDA",
        "form_data": {
            "purpose": "Evaluating AI collaboration",
            "effectiveDate": "2026-03-01",
            "governingLaw": "Delaware",
            "jurisdiction": "New Castle County",
            "party1": {"company": "Acme Corp", "name": "Jane Doe", "title": "CEO", "noticeAddress": "legal@acme.com", "date": "2026-03-01"},
            "party2": {"company": "Beta LLC", "name": "John Smith", "title": "CTO", "noticeAddress": "legal@beta.com", "date": "2026-03-01"},
        },
    }
    save_res = client.post("/api/documents", json=sample_doc)
    assert save_res.status_code == 200
    doc_data = save_res.json()
    doc_id = doc_data["id"]
    assert doc_data["title"] == "Acme - Beta NDA"
    assert doc_data["form_data"]["purpose"] == "Evaluating AI collaboration"

    # 3. Retrieve documents list
    list_res = client.get("/api/documents")
    assert list_res.status_code == 200
    docs = list_res.json()["documents"]
    assert len(docs) == 1
    assert docs[0]["id"] == doc_id

    # 4. Update document
    update_res = client.put(
        f"/api/documents/{doc_id}",
        json={
            "title": "Acme - Beta NDA (Final)",
            "form_data": {
                **sample_doc["form_data"],
                "purpose": "Finalized AI collaboration terms",
            },
        },
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Acme - Beta NDA (Final)"
    assert update_res.json()["form_data"]["purpose"] == "Finalized AI collaboration terms"

    # 5. Delete document
    del_res = client.delete(f"/api/documents/{doc_id}")
    assert del_res.status_code == 200

    # 6. Verify deleted
    get_res = client.get(f"/api/documents/{doc_id}")
    assert get_res.status_code == 404
