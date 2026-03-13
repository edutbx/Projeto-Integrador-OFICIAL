# Projeto Integrador - Saúde++

## Stack
- Frontend: React 18 + TypeScript + Create React App (porta 3000)
- Backend: Spring Boot 3.5.5 + Spring Security + JWT + MongoDB (porta 5000)
- IA: Python/FastAPI (porta 8000)
- Roteamento frontend: manual via window.location.pathname em App.tsx (sem React Router)

## Estrutura frontend
- `src/pages/` = wrappers de página
- `src/layout/` = corpo/lógica das páginas
- `src/componets/` = componentes reutilizáveis (typo proposital - "componets")
- `src/services/` = authService.ts, apiService.ts
- `src/hooks/` = useAuth.ts, useAuthGestor.ts
- `src/types/index.ts` = interfaces DTO

## Paleta de cores
- Azul primário: #3b6bc8
- Azul claro: #4d97e4
- Laranja: #f4a623
- Vermelho: #e05c35
- Fundo light: #f4f8ff
- Input bg: #fff8e8
- Font: Poppins

## Autenticação
- Médico: JWT via CRM+senha → POST /api/auth/login → localStorage keys: jwt, userCrm, userName, userSobrenome, userEspecializacao
- Gestor: JWT via email+senha → POST /api/auth/login-gestor → localStorage keys: gestor_jwt, gestor_email, gestor_nome, gestor_sobrenome
- checkAuth() médico: GET /api/medico
- checkAuthGestor(): GET /api/admin/medicos (exige ROLE_ADMIN)
- useAuth({proteger:true}) = proteção páginas médico
- useAuthGestor({proteger:true}) = proteção páginas gestor

## Rotas implementadas
Público: /, /sobreNos, /servicos, /contato, /entrar, /login, /login-gestor, /cadastro
Médico (protected): /medico, /novaConsulta, /prontuario
Gestor (protected): /gestor, /gestor/medicos

## Backend endpoints
- POST /api/auth/register = cadastro médico
- POST /api/auth/login = login médico (CRM+senha)
- POST /api/auth/login-gestor = login gestor (email+senha) — lógica em UserService
- GET /api/medico = verificação auth médico
- GET /api/auth/admin/medicos = lista médicos (ROLE_ADMIN obrigatório) — em AuthController, lógica em UserService

## Padrão MVC aplicado (backend)
- AuthController → recebe req, delega ao UserService para loginGestor e listarMedicos
- UserService → contém regras: loginGestor(), listarMedicos()
- UserRepository → findByRolesContaining(role) para buscar médicos sem findAll()
- GestorAuthException → exceção leve (status + message) para manter formato de erro do frontend
- AdminController → esvaziado (sem @RestController), Spring não registra

## URL alterada (importante)
- ANTES: /api/admin/medicos
- DEPOIS: /api/auth/admin/medicos
- Atualizado em: authService.ts (checkAuthGestor), BodyGestor.tsx, BodyGestorMedicos.tsx

## Credenciais padrão gestor (DatabaseSeeder)
- email: admin@example.com
- senha: admin123
- roles: ROLE_ADMIN, ROLE_USER

## Fluxo gestor → cadastrar médico
- /gestor → Médicos → /gestor/medicos → Cadastrar Médico → /cadastro?source=gestor
- source=gestor: usa registerSemSessao() (não sobrescreve sessão do gestor)
- Após cadastro: redireciona para /gestor

## Arquivos chave
- App.tsx: todas as rotas
- authService.ts: toda lógica de auth (médico + gestor)
- SecurityConfig.java: /api/admin/** exige hasRole("ADMIN")
- AdminController.java: GET /api/admin/medicos
- AuthController.java: todos os endpoints de auth
