# Pasta auth

A pasta `auth` implementa toda a lógica de autenticação e autorização do sistema. Ela é composta por subpastas que organizam controllers, DTOs, modelos, repositórios e serviços relacionados à autenticação de usuários.

## Subpastas e arquivos

- **controller/**
  - `AuthController.java`: Controller REST para endpoints de autenticação (login, registro, troca/reset de senha, deleção de usuário). Utiliza JWT para autenticação.
- **dto/**
  - `AuthResponse.java`, `LoginRequest.java`, `RegisterRequest.java`, `DeleteUserRequest.java`, `ResetarSenhaRequest.java`, `TrocarSenhaRequest.java`: Objetos de transferência de dados para requisições e respostas de autenticação.
- **model/**
  - `Usuario.java`: Entidade de usuário do sistema, com campos como nome, CRM, email, senha e roles.
- **repository/**
  - `UserRepository.java`: Interface de acesso ao banco de dados para usuários.
- **service/**
  - `JwtService.java`: Serviço para geração e validação de tokens JWT.
  - `CustomUserDetailsService.java`: Implementação de UserDetailsService para autenticação Spring Security.
  - `DatabaseSeeder.java`: Classe utilitária para popular o banco de dados com usuários iniciais.

## O que faz
- Permite login, registro, troca e reset de senha, deleção de usuários e geração/validação de JWT.
- Garante autenticação segura via Spring Security.

---

[Voltar ao README principal](../../../../../../README.md)
