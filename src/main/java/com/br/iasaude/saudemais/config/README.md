
# Configuração de Segurança e Autenticação (config)

A pasta `config` centraliza as classes responsáveis pela configuração de segurança do sistema usando Spring Boot e Spring Security.

## Como funciona a configuração

1. **Definição de regras de segurança**
	- A classe `SecurityConfig.java` define quais endpoints da API são públicos (ex: login, registro) e quais exigem autenticação.
	- Permite customizar regras para diferentes ambientes (ex: liberar tudo em `dev`).

2. **Filtro de autenticação JWT**
	- O `JwtAuthenticationFilter.java` intercepta todas as requisições HTTP.
	- Ele extrai o token JWT do header Authorization, valida o token e, se válido, autentica o usuário no contexto do Spring Security.

3. **Encoder de senhas**
	- O encoder de senhas garante que as senhas sejam armazenadas e comparadas de forma segura (ex: BCrypt).

	- O frontend envia o token JWT em cada requisição protegida.
	- O backend valida o token e libera ou bloqueia o acesso conforme as regras.

## Fluxo resumido

Usuário → (login) → Backend → (JWT) → Frontend → (requisição autenticada) → Backend (valida JWT) → acesso liberado/bloqueado

### Detalhes do fluxo JWT
- O backend envia o JWT como cookie após login.
- O filtro `JwtAuthenticationFilter` aceita o token tanto no header Authorization quanto no cookie.
- O frontend JS verifica o cookie JWT para proteger páginas.

## Arquivos principais

- `SecurityConfig.java`: Define regras de segurança, endpoints públicos/protegidos, encoder de senhas e integra o filtro JWT.
- `JwtAuthenticationFilter.java`: Filtro que valida o token JWT em cada requisição.

## Observações
- O sistema utiliza autenticação baseada em token JWT, garantindo segurança e escalabilidade.
- Permite fácil customização de regras de acesso e integração com outros módulos.

---

[Voltar ao README principal](../../../../../../README.md)
