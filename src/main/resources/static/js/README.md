
# Autenticação no Frontend (auth.js)

Este módulo implementa a lógica de autenticação do usuário médico via CRM e senha, protegendo páginas restritas do sistema.

## Como funciona a autenticação

1. **Login**
	- O usuário informa CRM e senha no formulário de login.
	- A função `login(crm, senha)` faz uma requisição POST para `/api/auth/login`.
	- Se o login for bem-sucedido, o backend retorna um token JWT, CRM e nome do usuário.
	- Esses dados são salvos no `localStorage` do navegador.

2. **Proteção de páginas**
	- A função `protegerPagina()` verifica se há um token JWT salvo.
	- Se não houver, redireciona o usuário para a página de login.
	- Pode ser chamada no início de páginas restritas (ex: médico, gestor).

3. **Verificação de autenticação**
	- A função `isAuthenticated()` retorna `true` se houver um token JWT salvo.

4. **Logout**
	- A função `logout()` remove o token e dados do usuário do `localStorage` e redireciona para o login.

5. **Obtenção do token**
	- A função `getToken()` retorna o token JWT salvo, útil para requisições autenticadas.

## Fluxo resumido

Usuário → (login) → Frontend → (POST /api/auth/login) → Backend → (JWT) → Frontend → (acesso liberado)

## Arquivo principal

- `auth.js`: Lógica de autenticação, proteção de páginas e gerenciamento do token JWT no frontend.

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
