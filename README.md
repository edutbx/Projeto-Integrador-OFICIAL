# Saúde ++ - Plataforma Médica

## Descrição do Projeto
O **Saúde ++** é uma plataforma web voltada exclusivamente para **profissionais de saúde**, oferecendo acesso centralizado e seguro a **prontuários médicos** e informações de pacientes. O objetivo é facilitar a tomada de decisão clínica, integrando dados de diferentes instituições em um único ambiente.

O sistema permite:
- Consulta de prontuários completos
- Acesso a exames laboratoriais e imagens
- Visualização de histórico de medicamentos
- Registro de observações médicas

## Tecnologias Utilizadas
- **Frontend:** HTML, CSS, Bootstrap
- **Backend:** API para integração e consulta de dados médicos
- **Inteligência Artificial:** Processamento de prontuários e interpretação automática de dados clínicos
- **Banco de Dados:** Estrutura pensada para armazenamento seguro de informações clínicas
- **Design:** Interface moderna e acessível, com foco em eficiência para o médico



## Estrutura de Pastas

```
Projeto-Integrador-OFICIAL/
├── README.md
├── frontend/
│   └── README.md
├── src/
│   └── main/
│       ├── java/
│       │   └── com/br/iasaude/saudemais/
│       │       ├── auth/README.md
│       │       ├── config/README.md
│       │       └── controller/README.md
│       └── resources/
│           ├── ia-integration/README.md
│           ├── static/
│           │   ├── README.md
│           │   ├── js/README.md
│           │   ├── img/README.md
│           │   └── CSS/
│           │       ├── README.md
│           │       ├── styleGestor/README.md
│           │       ├── styleHome/README.md
│           │       ├── styleLogin/README.md
│           │       ├── styleMedico/README.md
│           │       └── styleMedicoAntigo/README.md
│           └── templates/README.md
```

## Documentação Detalhada

| Módulo / Pasta | Descrição | Link |
|----------------|-----------|------|
| Backend - Auth | Lógica de autenticação, JWT, login | [src/main/java/com/br/iasaude/saudemais/auth/README.md](src/main/java/com/br/iasaude/saudemais/auth/README.md) |
| Backend - Config | Configuração de segurança, filtros | [src/main/java/com/br/iasaude/saudemais/config/README.md](src/main/java/com/br/iasaude/saudemais/config/README.md) |
| Backend - Controllers | Endpoints REST principais | [src/main/java/com/br/iasaude/saudemais/controller/README.md](src/main/java/com/br/iasaude/saudemais/controller/README.md) |
| Integração IA | Scripts e docs de integração IA | [src/main/resources/ia-integration/README.md](src/main/resources/ia-integration/README.md) |
| Frontend (React) | Documentação do frontend React | [frontend/README.md](frontend/README.md) |
| Static - JS | Lógica de autenticação JS | [src/main/resources/static/js/README.md](src/main/resources/static/js/README.md) |
| Static - CSS | Estilos customizados | [src/main/resources/static/CSS/README.md](src/main/resources/static/CSS/README.md) |
| Static - Imagens | Organização de imagens | [src/main/resources/static/img/README.md](src/main/resources/static/img/README.md) |
| Templates HTML | Templates das páginas do sistema | [src/main/resources/templates/README.md](src/main/resources/templates/README.md) |

Todos os links acima funcionam diretamente no GitHub.

## Como funciona o login e a proteção de páginas

O sistema utiliza autenticação baseada em JWT (JSON Web Token) via cookie para proteger páginas restritas.

### Fluxo de login
1. O usuário acessa a tela de login e informa CRM e senha.
2. O frontend faz um POST para `/api/auth/login`.
3. Se as credenciais estiverem corretas, o backend retorna um JWT e o envia como cookie.
4. O navegador armazena o cookie JWT automaticamente.
5. Ao acessar páginas protegidas, o JS verifica se o cookie JWT existe. Se não existir, redireciona para `/login`.
6. O backend valida o JWT em cada requisição protegida.

### Proteção de páginas
- As páginas protegidas (ex: /medico, /gestor, /prontuario, /novaconsulta) usam a função `protegerPagina()` do JS para garantir que só usuários autenticados acessem o conteúdo.
- O backend também exige JWT válido para acessar endpoints REST protegidos.

### Logout
- O logout remove o cookie JWT e redireciona para a tela de login.

### Observação
- O cookie JWT não é HttpOnly para permitir que o JS do frontend verifique a autenticação.

Veja detalhes técnicos nos READMEs das pastas `auth`, `config` e `static/js`.
