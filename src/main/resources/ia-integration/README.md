
# API de Integração de IA para o Projeto Integrador utilizando Adapter
Este módulo implementa o **padrão de projeto Adapter**, responsável por integrar o sistema principal com o serviço de Inteligência Artificial, garantindo o desacoplamento entre as camadas e a compatibilidade entre diferentes interfaces.

API é feita em Python usando FastAPI para integrar o Projeto Integrador com um modelo de IA fornecido pela Stackspot.

## Como funciona a integração

1. **Frontend/Backend faz uma requisição HTTP POST para o endpoint `/chat`**
	- O corpo da requisição deve conter um JSON com o prompt do usuário e, opcionalmente, informações como nome do paciente.

2. **O serviço FastAPI recebe a requisição**
	- O endpoint `/chat` processa o JSON recebido, extrai informações relevantes e registra no terminal quem enviou a mensagem e quando.

3. **Autenticação com Stackspot**
	- Antes de enviar a mensagem para a IA, o serviço obtém um token JWT autenticando-se na Stackspot usando client_id e client_secret.

4. **Requisição para o agente de IA**
	- O serviço monta um novo JSON com o prompt do usuário e outras opções, e faz uma requisição HTTP POST para o endpoint da Stackspot (`AGENT_URL`).
	- O token JWT é enviado no header Authorization.

5. **Resposta e logging**
	- O serviço imprime no terminal o conteúdo enviado para a IA, formatado de forma legível.
	- O mesmo conteúdo é retornado para o frontend, que pode exibir a resposta ao usuário.

## Fluxo resumido

Usuário → (POST /chat) → FastAPI → (autentica) → Stackspot IA → (resposta) → FastAPI → Usuário

## Arquivos principais

- `saude_mais.py`: Serviço FastAPI para receber prompts e retornar respostas da IA.

## Exemplo de requisição

```json
POST /chat
{
  "user_prompt": {
	 "nome": "Maria",
	 "pergunta": "Quais são os sintomas de gripe?"
  }
}
```

## Observações

- O serviço aceita requisições de qualquer origem (CORS liberado).
- O token de autenticação é obtido automaticamente a cada requisição.
- O serviço pode ser executado com:
  ```bash
  python -m uvicorn saude_mais:app --host 0.0.0.0 --port 8000
  ```
