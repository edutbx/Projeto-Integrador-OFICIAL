# 🩺 Saúde++ — Sistema de Gestão de Prontuários com IA

> Plataforma web voltada exclusivamente para profissionais de saúde, oferecendo acesso centralizado e seguro a prontuários médicos, com interpretação assistida por Inteligência Artificial para apoiar a decisão clínica.

Projeto Integrador desenvolvido como Trabalho de Conclusão de disciplina/curso, com foco em unir dados clínicos de diferentes fontes em um único ambiente e permitir que o médico consulte e interprete prontuários com o apoio de um assistente de IA (Gemini, via Google AI Studio).

---

## 📋 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Como rodar o projeto](#-como-rodar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Rodando com Docker](#rodando-com-docker-recomendado)
  - [Rodando manualmente](#rodando-manualmente)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Rotas da aplicação](#-rotas-da-aplicação)
- [Autenticação e segurança](#-autenticação-e-segurança)
- [Integração com IA](#-integração-com-ia)
- [Documentação por módulo](#-documentação-por-módulo)
- [Contribuindo](#-contribuindo)
- [Autores](#-autores)

---

## 📖 Sobre o projeto

O **Saúde++** é uma plataforma que permite que médicos façam login com CRM, acessem prontuários de pacientes e utilizem um assistente de Inteligência Artificial (baseado no **Google AI Studio / Gemini**) para interpretar dados clínicos de acordo com sua especialização, agilizando a análise de exames, históricos e observações médicas.

O sistema permite:

- 🔐 Login seguro de médicos (via CRM e senha)
- 📄 Consulta de prontuários completos dos pacientes
- 🧪 Acesso a exames laboratoriais e históricos de medicamentos
- 🤖 Interpretação de prontuários com apoio de IA
- 📝 Registro de observações e início de novas consultas
- 📊 Painel de gestão para acompanhamento administrativo

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Cadastro médico | Cadastro em 3 etapas, com validação de dados |
| Login com JWT | Autenticação baseada em CRM/senha com token JWT via cookie |
| Dashboard do médico | Visão geral de pacientes e consultas |
| Prontuário + IA | Leitura de prontuário (inclusive PDFs) com interpretação assistida por IA |
| Nova consulta | Registro de uma nova consulta médica |
| Painel do gestor | Área administrativa do sistema |

---

## 🏗️ Arquitetura

O projeto é composto por **frontend, backend e banco de dados**, orquestrados via Docker Compose. A interpretação com IA acontece diretamente no cliente, via **Google AI Studio (Gemini API)**:

```
┌──────────────────┐      ┌─────────────────────┐      ┌────────────────────┐
│   Frontend         │      │   Backend              │      │   MongoDB            │
│   React + TS       │ ───► │   Spring Boot (Java)   │ ───► │   (porta 27017)      │
│   (porta 3000/80)  │      │   (porta 5000)         │      └────────────────────┘
└─────────┬─────────┘      └────────────────────┘
          │
          ▼
┌──────────────────────┐
│  Google AI Studio      │
│  (Gemini API)          │
└──────────────────────┘
```

- O **Backend (Spring Boot)** expõe os endpoints REST, autentica os usuários via JWT, persiste dados no **MongoDB** e extrai o texto de PDFs de prontuários com **Apache PDFBox** (`/api/interpretar-pdf`).
- O **Frontend (React + TypeScript)** consome a API do backend e concentra a inteligência artificial: o componente `AIAssistant` chama diretamente a **API do Google AI Studio (Gemini)**, via SDK `@google/genai`, enviando os dados do prontuário do paciente como contexto e recebendo a interpretação clínica em tempo real, direto no navegador do médico.

---

## 🛠️ Tecnologias utilizadas

### Backend
- **Java 17** + **Spring Boot 3.5.5**
- Spring Security + JWT (`jjwt`) para autenticação
- Spring Data MongoDB
- Thymeleaf (+ integração com Spring Security)
- Apache PDFBox (extração de texto de PDFs de prontuários)
- Lombok
- Maven

### Inteligência Artificial
- **Google AI Studio** — modelo **Gemini** (`gemini-2.5-flash`)
- SDK `@google/genai`, consumido diretamente pelo componente `AIAssistant.tsx` no frontend

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build e dev server)
- `@google/genai` (integração com o Gemini, via Google AI Studio)
- `react-markdown`, `lucide-react`
- Vitest + Testing Library (testes)
- ESLint

### Banco de dados
- **MongoDB 6.x/7**

### Infraestrutura
- **Docker** e **Docker Compose**
- Nginx (servindo o build do frontend em produção)
- GitHub Actions (`.github/workflows`)

---

## 📁 Estrutura de pastas

```
Projeto-Integrador-OFICIAL/
├── backend/                          # API Spring Boot
│   ├── src/main/java/com/br/iasaude/saudemais/
│   │   ├── auth/                     # Autenticação, JWT, login, cadastro, controllers REST
│   │   ├── config/                   # Configurações de segurança e filtros
│   │   └── controller/               # Endpoints REST principais
│   ├── src/main/resources/
│   │   ├── static/                   # JS, CSS e imagens
│   │   └── templates/                # Templates HTML (Thymeleaf)
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                         # Aplicação React + TypeScript
│   ├── src/components/AIAssistant.tsx  # Assistente clínico com Google AI Studio (Gemini)
│   ├── package.json
│   └── ...
├── mudanças/                         # Registro de alterações do projeto
├── .github/workflows/                # Pipelines de CI/CD
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- **Java 17** (`java -version`)
- **Maven 3.8+** (`mvn -v`)
- **MongoDB 6.x+** (local ou via Docker)
- **Node.js 18+** e **npm** (`node -v` / `npm -v`)
- **Docker** e **Docker Compose** (opcional, para rodar tudo de forma orquestrada)
- Uma **chave de API do Google AI Studio** (Gemini), para o assistente de IA funcionar no frontend

### Rodando com Docker (recomendado)

O jeito mais simples de subir o ambiente completo (MongoDB + Backend + Frontend) é via Docker Compose:

```bash
docker compose up -d
```

Isso irá subir:
- **MongoDB** em `localhost:27017`
- **Backend (Spring Boot)** em `localhost:5000`
- **Frontend** (servido via Nginx) em `localhost:3000`

### Rodando manualmente

#### 1. Banco de dados (MongoDB)

Instale o [MongoDB Community](https://www.mongodb.com/try/download/community), inicie o serviço (`mongod`) e certifique-se de que está rodando em `localhost:27017`. O banco utilizado é o `saude`.

#### 2. Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
# Acesse: http://localhost:5000
```

#### 3. Frontend (React + Vite)

Crie um arquivo `.env` dentro de `frontend/` com sua chave do Google AI Studio:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

Depois, rode:

```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:3000 (proxy automático para o backend em :5000)
```

#### Build de produção do frontend

```bash
cd frontend
npm run build
# Copie o conteúdo de dist/ (ou build/) para backend/src/main/resources/static/
```

---

## 🔑 Variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha os valores necessários. **Nunca versione segredos.**

```env
# Frontend (React) — usado pela integração com o Google AI Studio (Gemini) na UI
VITE_GEMINI_API_KEY=

# Backend Java (Spring Boot)
# SPRING_APPLICATION_NAME=Saude
# SERVER_PORT=5000
# SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/saude
# VIACEP_BASE_URL=https://viacep.com.br/ws
```

A chave `VITE_GEMINI_API_KEY` pode ser gerada gratuitamente no [Google AI Studio](https://aistudio.google.com/) e é obrigatória para que o assistente de IA (`AIAssistant.tsx`) funcione no frontend.

---

## 🗺️ Rotas da aplicação

| Rota | Página | Autenticação |
|---|---|---|
| `/` | Página inicial | Livre |
| `/sobreNos` | Sobre nós | Livre |
| `/login` | Login | Livre |
| `/cadastro` | Cadastro médico (3 passos) | Livre |
| `/medico` | Dashboard do médico | 🔒 JWT |
| `/novaConsulta` | Iniciar consulta | 🔒 JWT |
| `/prontuario` | Prontuário + IA | 🔒 JWT |
| `/gestor` | Painel do gestor | 🔒 JWT |

---

## 🔐 Autenticação e segurança

O sistema utiliza autenticação baseada em **JWT (JSON Web Token)** via cookie:

1. O usuário acessa a tela de login e informa **CRM** e **senha**.
2. O frontend envia um `POST` para `/api/auth/login`.
3. Se as credenciais forem válidas, o backend gera um JWT e o envia como cookie ao navegador.
4. Ao acessar páginas protegidas, o JS do frontend verifica a existência do cookie (função `protegerPagina()`); se ausente, redireciona para `/login`.
5. O backend valida o JWT em toda requisição a endpoints protegidos.
6. O **logout** remove o cookie JWT e redireciona para a tela de login.

> ⚠️ O cookie JWT **não é HttpOnly**, para permitir que o JavaScript do frontend verifique a autenticação no client-side.

As senhas dos usuários são armazenadas de forma criptografada no MongoDB, e o cadastro inicial de usuários pode ser populado via a classe utilitária `DatabaseSeeder.java`.

---

## 🤖 Integração com IA

A interpretação clínica assistida por IA é feita com o **Google AI Studio**, usando o modelo **Gemini (`gemini-2.5-flash`)**, através do componente `AIAssistant.tsx` no frontend. A chamada à IA acontece **diretamente do navegador**, via SDK `@google/genai`, sem passar por um serviço intermediário.

**Fluxo resumido:**

```
Médico → digita pergunta no chat → AIAssistant.tsx monta o contexto do paciente
       → chamada direta à API do Google AI Studio (Gemini) → resposta exibida no chat
```

1. O médico abre a tela de **Prontuário** e interage com o **Saúde ++ Copilot** (chat de IA integrado).
2. O componente `AIAssistant` monta uma instrução de sistema (*system instruction*) com os dados do paciente selecionado — nome, idade, sexo, tipo sanguíneo, alergias, condições, medicamentos, exames, consultas recentes e notas.
3. O prompt do médico é combinado com o histórico da conversa e enviado à API do **Google AI Studio** via `ai.models.generateContent`, usando o modelo `gemini-2.5-flash`.
4. A resposta da IA é renderizada no chat em Markdown, sempre reforçando que as sugestões **não substituem o julgamento clínico do médico**.

Além do chat, o backend expõe o endpoint `POST /api/interpretar-pdf`, que recebe um arquivo PDF de prontuário, extrai o texto com **Apache PDFBox** e o disponibiliza para uso no fluxo de interpretação.

> ⚠️ A chave de API do Gemini (`VITE_GEMINI_API_KEY`) é usada diretamente no cliente (frontend). Para produção, avalie mover essa chamada para o backend, evitando expor a chave no navegador.

---

## 📚 Documentação por módulo

Cada módulo do projeto possui documentação própria e mais detalhada:

| Módulo | Descrição |
|---|---|
| `backend/src/main/java/.../auth` | Autenticação, JWT, login e cadastro |
| `backend/src/main/java/.../config` | Configuração de segurança e filtros |
| `backend/src/main/java/.../controller` | Endpoints REST principais (inclui `/api/interpretar-pdf`) |
| `backend/src/main/resources/static` | JS, CSS e imagens do frontend server-side (Thymeleaf) |
| `backend/src/main/resources/templates` | Templates HTML das páginas |
| `frontend/src/components/AIAssistant.tsx` | Assistente clínico com IA (Google AI Studio / Gemini) |
| `frontend/` | Aplicação React + TypeScript |

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona minha feature'`)
4. Faça push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## 👥 Autores

Projeto desenvolvido como **Trabalho/Projeto Integrador** de faculdade.

---

<p align="center">Feito com 💙 para facilitar o trabalho de profissionais de saúde.</p>
