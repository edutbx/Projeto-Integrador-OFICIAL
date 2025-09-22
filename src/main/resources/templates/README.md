# Pasta templates

Esta pasta contém os arquivos HTML usados como templates para as páginas do sistema. Cada arquivo representa uma tela do sistema web:

- `gestor.html`: Painel do gestor, com cards de serviços e menu lateral.
- `index.html`: Página inicial do sistema, com apresentação dos serviços e navegação.
- `login.html`: Tela de login para médicos.
- `medico.html`: Painel do médico, exibe agenda e dados protegidos.
- `medicoAntigo.html`: Versão antiga do painel do médico.
- `novaconsulta.html`: Tela para iniciar uma nova consulta, busca paciente por CPF.
- `prontuario.html`: Tela de visualização e interpretação de prontuário do paciente, com upload de PDF e integração com IA.
- `register.html`: Tela de cadastro de novos usuários (médicos).


## Proteção de páginas e login

As páginas protegidas (ex: médico, gestor, prontuário, nova consulta) usam o JS (`auth.js`) para garantir que só usuários autenticados (com cookie JWT válido) possam acessar o conteúdo. O login é feito via CRM e senha, e o backend envia o JWT como cookie após autenticação.

[Voltar ao README principal](../../../../README.md)
