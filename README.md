# Saúde++ — Sistema de Gestão de Prontuários com IA

## Estrutura
```
saudemais-completo/
├── backend/    ← Spring Boot (porta 5000)
└── frontend/   ← React + TypeScript (porta 3000)
```

## Como rodar

### Backend
```bash
cd backend
./mvn spring-boot:run
# Acesse: http://localhost:5000
```

### Frontend (desenvolvimento)
```bash
cd frontend
npm install
npm start
# Acesse: http://localhost:3000
# (proxy automático para o backend em :5000)
```

### Build de produção
```bash
cd frontend
npm run build
# Copie o conteúdo de build/ para backend/src/main/resources/static/
```

## Páginas
| Rota | Página |
|------|--------|
| `/` | Página inicial |
| `/sobreNos` | Sobre nós |
| `/login` | Login |
| `/cadastro` | Cadastro médico (3 passos) |
| `/medico` | Dashboard do médico 🔒 |
| `/novaConsulta` | Iniciar consulta 🔒 |
| `/prontuario` | Prontuário + IA 🔒 |
| `/gestor` | Painel do gestor 🔒 |

🔒 = requer autenticação JWT

## Credenciais de teste
Use as credenciais do banco de dados configurado no backend.
