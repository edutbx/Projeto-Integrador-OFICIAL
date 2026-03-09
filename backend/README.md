## Como rodar o projeto (Pré-requisitos e Passo a Passo)

### 1. Java, Maven e Spring Boot
- **Java:** Versão **21** (confirme com `java -version`)
- **Maven:** Recomendado Maven **3.8+** (confirme com `mvn -v`)
- **Spring Boot:** O projeto já usa Spring Boot **3.5.5** (gerenciado pelo Maven)

### 2. MongoDB
- **Versão recomendada:** MongoDB **6.x** ou superior
- **Como instalar:**  
	- [Download MongoDB Community](https://www.mongodb.com/try/download/community)
	- Após instalar, inicie o serviço (`mongod`) e certifique-se de que está rodando em `localhost:27017`
	- O banco usado será `saude` (configurado em `application.properties`)

### 3. Python e FastAPI (Integração IA)
- **Python:** Versão **3.10+** recomendada (confirme com `python --version`)
- **Instale o FastAPI e dependências:**
	- No terminal, navegue até `src/main/resources/ia-integration/`
	- Instale FastAPI e Uvicorn:
		```
		pip install fastapi uvicorn requests
		```
	- (Não há `requirements.txt`, mas as dependências usadas são: `fastapi`, `uvicorn`, `requests`)

- **Como rodar o serviço IA:**
	```
	python -m uvicorn saude_mais:app --host 0.0.0.0 --port 8000
	```


### 4. Frontend (React)
- **ATENÇÃO:** O frontend em React **ainda não está implementado e está em desenvolvimento**. Por enquanto, utilize **exclusivamente o backend Spring Boot** para acessar o sistema.
- As instruções abaixo são apenas para referência futura:
	- **Node.js:** Versão **18+** recomendada (confirme com `node -v` e `npm -v`)
	- Para instalar dependências do frontend:
		- No terminal, navegue até a pasta `frontend/`
		- Execute:
			```
			npm install
			```
		- Para rodar o frontend:
			```
			npm start
			```

### 5. Como rodar o backend (Spring Boot)
- No terminal, na raiz do projeto:
	```
	./mvnw spring-boot:run
	```
	ou, se preferir:
	```
	mvn spring-boot:run
	```

---

## Resumo dos passos

1. **Instale Java 21 e Maven**
2. **Instale e inicie o MongoDB**
3. **Instale Python 3.10+ e as libs FastAPI, Uvicorn, Requests**
4. **Rode o serviço IA (FastAPI)**
5. **Instale Node.js, rode `npm install` e `npm start` no frontend**
6. **Rode o backend com Maven**

---
## Dependências do Backend (pom.xml)

| Dependência | Função |
|------------|--------|
| spring-boot-starter-security | Autenticação, autorização e proteção de endpoints com Spring Security |
| spring-boot-starter-thymeleaf | Templates HTML dinâmicos com Thymeleaf |
| spring-boot-starter-web | Criação de APIs REST e aplicações web |
| spring-boot-devtools | Ferramentas de desenvolvimento, reload automático |
| thymeleaf-extras-springsecurity6 | Integração Thymeleaf + Spring Security |
| spring-boot-starter-data-mongodb | Integração e persistência de dados com MongoDB |
| lombok | Geração automática de getters/setters/construtores |
| jakarta.validation-api | Validação de dados (ex: @NotNull, @Email) |
| spring-boot-starter-test | Ferramentas para testes unitários e de integração |
| spring-security-test | Utilitários para testar autenticação/autorização |
| pdfbox | Leitura e manipulação de arquivos PDF em Java |
| jjwt-api, jjwt-impl, jjwt-jackson | Criação, assinatura e validação de tokens JWT |

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
