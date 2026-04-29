import importlib.util
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient
from fastapi import HTTPException

MODULE_PATH = Path(__file__).resolve().parent / "saude_mais.py"
SPEC = importlib.util.spec_from_file_location("saude_mais", MODULE_PATH)
saude_mais = importlib.util.module_from_spec(SPEC)
sys.modules["saude_mais"] = saude_mais
SPEC.loader.exec_module(saude_mais)


def test_get_jwt_success_returns_access_token():
    fake_response = MagicMock()
    fake_response.status_code = 200
    fake_response.json.return_value = {"access_token": "jwt-token"}

    with patch.dict("os.environ", {
        "STACKSPOT_REALM": "stackspot-freemium",
        "STACKSPOT_CLIENT_ID": "client-id",
        "STACKSPOT_CLIENT_KEY": "client-key",
    }, clear=False):
        with patch.object(saude_mais.requests, "post", return_value=fake_response) as mock_post:
            token = saude_mais.get_jwt()

    assert token == "jwt-token"
    mock_post.assert_called_once()


def test_get_jwt_failure_raises_http_exception():
    fake_response = MagicMock()
    fake_response.status_code = 401

    with patch.dict("os.environ", {
        "STACKSPOT_REALM": "stackspot-freemium",
        "STACKSPOT_CLIENT_ID": "client-id",
        "STACKSPOT_CLIENT_KEY": "client-key",
    }, clear=False):
        with patch.object(saude_mais.requests, "post", return_value=fake_response):
            try:
                saude_mais.get_jwt()
                assert False, "Expected HTTPException"
            except HTTPException as exc:
                assert exc.status_code == 401
                assert exc.detail == "Erro na autenticação"


def test_get_jwt_missing_env_raises_http_exception():
    with patch.dict("os.environ", {}, clear=True):
        try:
            saude_mais.get_jwt()
            assert False, "Expected HTTPException"
        except HTTPException as exc:
            assert exc.status_code == 500
            assert "STACKSPOT_REALM" in exc.detail


def test_chat_invalid_json_returns_error_payload():
    client = TestClient(saude_mais.app)

    response = client.post("/chat", content="{invalid", headers={"Content-Type": "application/json"})

    assert response.status_code == 200
    body = response.json()
    assert body["erro"] == "JSON inválido"


def test_chat_builds_payload_from_user_prompt_dict_and_returns_formatted_text():
    client = TestClient(saude_mais.app)
    payload = {
        "user_prompt": {
            "nome": "Carlos",
            "sintoma": "dor",
        }
    }

    fake_agent_response = MagicMock()
    fake_agent_response.status_code = 200

    with patch.dict("os.environ", {
        "STACKSPOT_AGENT_URL": "https://example.test/agent/chat",
    }, clear=False):
        with patch.object(saude_mais, "get_jwt", return_value="jwt-123") as mock_get_jwt:
            with patch.object(saude_mais.requests, "post", return_value=fake_agent_response) as mock_post:
                response = client.post("/chat", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert "Mensagem enviada ao agente:" in body["resposta"]
    assert "streaming: True" in body["resposta"]
    assert "user_prompt:" in body["resposta"]
    assert "nome: Carlos" in body["resposta"]
    assert "sintoma: dor" in body["resposta"]

    mock_get_jwt.assert_called_once()
    mock_post.assert_called_once_with(
        "https://example.test/agent/chat",
        json={
            "streaming": True,
            "user_prompt": "nome: Carlos\nsintoma: dor",
            "stackspot_knowledge": False,
            "return_ks_in_response": True,
        },
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer jwt-123",
        },
    )


def test_chat_uses_nome_fallback_when_user_prompt_is_not_dict():
    client = TestClient(saude_mais.app)
    payload = {
        "nome": "Paciente X",
        "user_prompt": "texto simples",
    }

    fake_agent_response = MagicMock()
    fake_agent_response.status_code = 200

    with patch.dict("os.environ", {
        "STACKSPOT_AGENT_URL": "https://example.test/agent/chat",
    }, clear=False):
        with patch.object(saude_mais, "get_jwt", return_value="jwt-123"):
            with patch.object(saude_mais.requests, "post", return_value=fake_agent_response):
                response = client.post("/chat", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert "user_prompt: texto simples" in body["resposta"]
