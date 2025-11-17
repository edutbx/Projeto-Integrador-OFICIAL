
# Autenticação no Frontend (auth.js)

Este módulo implementa a lógica de autenticação do usuário médico via CRM e senha, protegendo páginas restritas do sistema.

## Como funciona a autenticação


1. **Login**
	- O usuário informa CRM e senha no formulário de login.
	- A função `login(crm, senha)` faz uma requisição POST para `/api/auth/login`.
	- Se o login for bem-sucedido, o backend retorna um token JWT, CRM e nome do usuário.
	- O JWT é enviado como cookie pelo backend e armazenado automaticamente pelo navegador.
	- O JS salva apenas dados não sensíveis (nome, CRM) no localStorage.

2. **Proteção de páginas**
	- A função `protegerPagina()` verifica se o cookie JWT existe (lendo via `document.cookie`).
	- Se não houver, redireciona o usuário para a página de login.
	- Pode ser chamada no início de páginas restritas (ex: médico, gestor, prontuário, nova consulta).

3. **Verificação de autenticação**
	- A função `isAuthenticated()` retorna `true` se o cookie JWT existir.

4. **Logout**
	- A função `logout()` remove o cookie JWT e dados do usuário do `localStorage` e redireciona para o login.

5. **Obtenção do token**
	- A função `getToken()` lê o valor do cookie JWT, útil para requisições autenticadas.

## Fluxo resumido

Usuário → (login) → Frontend → (POST /api/auth/login) → Backend → (JWT em cookie) → Frontend → (acesso liberado)

## Arquivo principal

- `auth.js`: Lógica de autenticação, proteção de páginas e gerenciamento do token JWT via cookie no frontend.

## Exemplo de uso

```js
// Proteger página restrita
protegerPagina();

// Fazer login
login('123456', 'senha123').then(...);

// Fazer logout
logout();
```

## Observações
- O token JWT é salvo apenas no navegador, não no backend.
- O backend deve validar o token em cada requisição protegida.
- O sistema permite fácil integração com outras páginas protegidas.

---

[Voltar ao README da pasta static](../README.md)
