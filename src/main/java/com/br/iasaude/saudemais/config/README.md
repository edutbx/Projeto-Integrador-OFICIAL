# Pasta config

A pasta `config` contém as classes de configuração do Spring Boot para segurança e autenticação do sistema.

## Arquivos
- `SecurityConfig.java`: Configura as regras de segurança da aplicação, define endpoints públicos/protegidos, integra o filtro JWT e configura o encoder de senhas.
- `JwtAuthenticationFilter.java`: Filtro que intercepta requisições, valida o token JWT e autentica o usuário no contexto do Spring Security.

## O que faz
- Define quais endpoints exigem autenticação e quais são públicos.
- Aplica o filtro JWT para autenticação baseada em token.
- Permite configuração diferenciada para ambiente de desenvolvimento (`dev`).

---

[Voltar ao README principal](../../../../../../README.md)
