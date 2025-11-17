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




## Guia rápido: Banco de Dados de Usuários

## Como funciona o login JWT

- O endpoint `/api/auth/login` recebe CRM e senha, valida o usuário e gera um JWT.
- O JWT é enviado como cookie (não HttpOnly) para o navegador.
- O frontend usa esse cookie para autenticar o usuário em páginas protegidas.
- O backend valida o JWT em cada requisição protegida.
- O logout remove o cookie JWT.

O sistema utiliza um banco de dados (MongoDB) para armazenar os dados dos usuários, incluindo nome, CRM, email, senha (criptografada) e permissões (roles).

### Como funciona
- O repositório `UserRepository.java` faz a ponte entre a aplicação e o banco de dados.
- As operações de login, registro, deleção e alteração de senha interagem com o banco via este repositório.
- O modelo `Usuario.java` representa a estrutura dos dados salvos.

### Como usar
1. **Cadastro de usuário**: Ao registrar um novo usuário pelo endpoint de registro, os dados são salvos automaticamente no banco.
2. **Login**: O sistema busca o usuário pelo CRM/email e valida a senha criptografada.
3. **Alteração/Reset de senha**: Atualiza o campo de senha no banco, sempre de forma criptografada.
4. **Deleção de usuário**: Remove o registro do usuário do banco.

### Dicas para desenvolvedores
- Para visualizar ou manipular os dados, use uma ferramenta como MongoDB Compass ou comandos do Mongo Shell.
- O banco é configurado via a string de conexão em `application.properties`:
  ```
  spring.data.mongodb.uri=mongodb://localhost:27017/saude
  ```
- Para popular o banco com usuários iniciais, utilize a classe `DatabaseSeeder.java`.

---

[Voltar ao README principal](../../../../../../README.md)
