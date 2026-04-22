#iniciar o servidor: python -m uvicorn saude_mais:app --host 0.0.0.0 --port 8000

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import os

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

def _require_env(name: str) -> str:
	value = os.getenv(name)
	if not value:
		raise HTTPException(status_code=500, detail=f"Configuração ausente: {name}")
	return value

def get_jwt():
	realm = _require_env("STACKSPOT_REALM")
	client_id = _require_env("STACKSPOT_CLIENT_ID")
	client_key = _require_env("STACKSPOT_CLIENT_KEY")
	url = f"https://idm.stackspot.com/{realm}/oidc/oauth/token"
	payload = {
		"grant_type": "client_credentials",
		"client_id": client_id,
		"client_secret": client_key
	}
	headers = {"Content-Type": "application/x-www-form-urlencoded"}
	response = requests.post(url, data=payload, headers=headers)
	if response.status_code != 200:
		raise HTTPException(status_code=401, detail="Erro na autenticação")
	return response.json().get("access_token")

@app.post("/chat")
async def chat(request: Request):
	import datetime
	body_raw = await request.body()
	try:
		body = json.loads(body_raw)
	except Exception as e:
		print("Erro ao fazer parsing do JSON:", e)
		return {"erro": "JSON inválido", "corpo": body_raw.decode('utf-8', errors='replace')}
	# Extrai nome do paciente do JSON recebido
	nome_paciente = None
	if isinstance(body.get("user_prompt"), dict):
		nome_paciente = body["user_prompt"].get("nome")
	if not nome_paciente:
		nome_paciente = body.get("nome", "Desconhecido")
	horario = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
	print(f"Mensagem recebida de {nome_paciente} às {horario}")
	user_prompt = body.get("user_prompt")
	if isinstance(user_prompt, dict):
		user_prompt = "\n".join([f"{k}: {v}" for k, v in user_prompt.items()])
	jwt = get_jwt()
	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer {jwt}"
	}
	data = {
		"streaming": True,
		"user_prompt": user_prompt,
		"stackspot_knowledge": False,
		"return_ks_in_response": True
	}
	agent_url = _require_env("STACKSPOT_AGENT_URL")
	response = requests.post(agent_url, json=data, headers=headers)
	# Monta o texto formatado igual ao terminal
	texto_formatado = "Mensagem enviada ao agente:\n"
	for k, v in data.items():
		if isinstance(v, str) and '\n' in v:
			texto_formatado += f"{k}:\n"
			for linha in v.splitlines():
				texto_formatado += f"  {linha}\n"
		else:
			texto_formatado += f"{k}: {v}\n"
	print(texto_formatado.rstrip())
	# Retorna o mesmo texto para o frontend
	return {"resposta": texto_formatado.rstrip()}
