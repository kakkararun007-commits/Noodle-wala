"""Backend API tests for NoodleWala.com"""
import os
import re
import time
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
BASE = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE:
    # Fallback to reading frontend .env
    fe_env = Path(__file__).resolve().parents[2] / "frontend" / ".env"
    for line in fe_env.read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE = line.split("=", 1)[1].strip().rstrip("/")

API = f"{BASE}/api"


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# -------- Content endpoints --------
class TestContent:
    def test_root(self, s):
        r = s.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("brand") == "NoodleWala"

    def test_config(self, s):
        r = s.get(f"{API}/config")
        assert r.status_code == 200
        j = r.json()
        assert j["brand"]["name"] == "NoodleWala"
        assert "2026 NoodleWala.com" in j["legal"]["copyright"]

    def test_collections_count(self, s):
        r = s.get(f"{API}/collections")
        assert r.status_code == 200
        cols = r.json()["collections"]
        assert len(cols) == 8
        for c in cols:
            assert "product_count" in c

    def test_collection_detail(self, s):
        r = s.get(f"{API}/collections/japan")
        assert r.status_code == 200
        j = r.json()
        assert j["collection"]["slug"] == "japan"
        assert len(j["products"]) >= 1

    def test_collection_404(self, s):
        assert s.get(f"{API}/collections/nope").status_code == 404

    def test_products_list(self, s):
        r = s.get(f"{API}/products")
        assert r.status_code == 200
        j = r.json()
        assert j["total"] == 12
        assert len(j["products"]) == 12

    def test_products_filter_origin(self, s):
        r = s.get(f"{API}/products", params={"origin": "korea"})
        assert r.status_code == 200
        for p in r.json()["products"]:
            assert p["origin_slug"] == "korea"

    def test_products_filter_try_buy(self, s):
        r = s.get(f"{API}/products", params={"try_buy": "true"})
        for p in r.json()["products"]:
            assert p["try_buy_eligible"] is True

    def test_products_search_empty(self, s):
        r = s.get(f"{API}/products", params={"search": "zzzzzzzznotexist"})
        assert r.json()["total"] == 0

    def test_product_detail(self, s):
        r = s.get(f"{API}/products/tokyo-shoyu-ramen")
        assert r.status_code == 200
        j = r.json()
        assert j["product"]["slug"] == "tokyo-shoyu-ramen"
        assert isinstance(j["related"], list)

    def test_product_404(self, s):
        assert s.get(f"{API}/products/nope-xyz").status_code == 404

    def test_stores_list(self, s):
        r = s.get(f"{API}/stores")
        assert r.status_code == 200
        j = r.json()
        assert len(j["stores"]) == 3
        assert "Mumbai" in j["cities"]

    def test_stores_search_mumbai(self, s):
        r = s.get(f"{API}/stores", params={"q": "Mumbai"})
        assert len(r.json()["stores"]) == 1

    def test_try_and_buy(self, s):
        r = s.get(f"{API}/try-and-buy")
        assert r.status_code == 200
        j = r.json()
        assert len(j["stores"]) == 2  # only available + selected_days
        assert len(j["products"]) >= 1

    def test_knowledge(self, s):
        r = s.get(f"{API}/knowledge", params={"q": "Try"})
        assert r.status_code == 200
        assert len(r.json()["articles"]) >= 1


# -------- Franchise / Contact / Tickets --------
class TestForms:
    def test_franchise_validation(self, s):
        r = s.post(f"{API}/franchise-leads", json={})
        assert r.status_code == 422

    def test_franchise_consent_required(self, s):
        r = s.post(f"{API}/franchise-leads", json={
            "name": "Test User", "mobile": "+919999911111",
            "city": "Mumbai", "state": "MH",
            "consent_contact": False, "consent_privacy": True
        })
        assert r.status_code == 422

    def test_franchise_success(self, s):
        r = s.post(f"{API}/franchise-leads", json={
            "name": "TEST Franchise", "mobile": f"+9199{int(time.time())%100000000:08d}",
            "email": f"test{int(time.time())}@example.com",
            "city": "Bengaluru", "state": "Karnataka",
            "consent_contact": True, "consent_privacy": True
        })
        assert r.status_code in (200, 201)
        j = r.json()
        assert "franchise partner" in j["message"]

    def test_contact_success(self, s):
        r = s.post(f"{API}/contact", json={
            "name": "TEST Contact", "mobile": "+919000000001",
            "email": "c@example.com", "enquiry_type": "General Enquiry",
            "message": "Hello, this is a test", "consent": True
        })
        assert r.status_code in (200, 201)

    def test_contact_bad_enquiry_type(self, s):
        r = s.post(f"{API}/contact", json={
            "name": "TEST", "mobile": "+919000000002", "enquiry_type": "Bad",
            "message": "hello world", "consent": True
        })
        assert r.status_code == 422


# -------- Tickets and lookup --------
class TestTickets:
    TICKET_NUMBER = None
    TICKET_MOBILE = "+919888877777"

    def test_ticket_create(self, s):
        r = s.post(f"{API}/tickets", json={
            "name": "TEST Ticket", "mobile": self.TICKET_MOBILE,
            "email": "t@example.com", "category": "General Enquiry",
            "subject": "Testing ticket creation",
            "description": "This is a test ticket description.",
            "consent": True
        })
        assert r.status_code in (200, 201), r.text
        j = r.json()
        tn = j["ticket"]["ticket_number"]
        assert re.match(r"^NW-\d{6}$", tn), tn
        TestTickets.TICKET_NUMBER = tn

    def test_ticket_lookup_success(self, s):
        assert TestTickets.TICKET_NUMBER
        r = s.get(f"{API}/tickets/lookup", params={
            "ticket_number": TestTickets.TICKET_NUMBER,
            "mobile": TestTickets.TICKET_MOBILE
        })
        assert r.status_code == 200
        assert r.json()["ticket"]["ticket_number"] == TestTickets.TICKET_NUMBER

    def test_ticket_lookup_wrong_mobile(self, s):
        assert TestTickets.TICKET_NUMBER
        r = s.get(f"{API}/tickets/lookup", params={
            "ticket_number": TestTickets.TICKET_NUMBER,
            "mobile": "+911111111111"
        })
        assert r.status_code == 403

    def test_ticket_lookup_not_found(self, s):
        r = s.get(f"{API}/tickets/lookup", params={
            "ticket_number": "NW-000000", "mobile": "+919999999999"
        })
        assert r.status_code == 404


# -------- AI chat SSE --------
class TestAI:
    def test_ai_chat_stream(self, s):
        r = requests.post(f"{API}/ai/chat",
                          json={"message": "How does Try & Buy work?"},
                          stream=True, timeout=60)
        assert r.status_code == 200
        got_delta = False
        got_done = False
        start = time.time()
        for raw in r.iter_lines(decode_unicode=True):
            if time.time() - start > 45:
                break
            if not raw or not raw.startswith("data: "):
                continue
            import json
            try:
                data = json.loads(raw[6:])
            except Exception:
                continue
            if "delta" in data:
                got_delta = True
            if "error" in data:
                pytest.fail(f"AI error: {data}")
            if data.get("done"):
                got_done = True
                break
        assert got_delta, "No delta received from AI stream"
        assert got_done, "Stream did not complete with done"
