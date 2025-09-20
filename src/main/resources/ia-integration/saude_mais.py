#iniciar o servidor: python -m uvicorn saude_mais:app --host 0.0.0.0 --port 8000

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import json

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

REALM = "stackspot-freemium"
CLIENT_ID = "f56b6b65-6488-4401-9a94-c4c211654497"
CLIENT_KEY = "y5Hlvve2jo2ci23HdzhafYpYni04l43BBY12MemAER5LqR5rdfy57ZA5g76CF93o"
AGENT_URL = "https://genai-inference-app.stackspot.com/v1/agent/01K3GT29GMFY5HMCEM7F8HSNKN/chat"

def get_jwt():
	url = f"https://idm.stackspot.com/{REALM}/oidc/oauth/token"
	payload = {
		"grant_type": "client_credentials",
		"client_id": CLIENT_ID,
		"client_secret": CLIENT_KEY
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
	response = requests.post(AGENT_URL, json=data, headers=headers)
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
