require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Importar o pacote cors
const pacienteRoutes = require("./routes/pacienteRoutes");
const medicoRoutes = require("./routes/medicoRoutes");
const gestorRoutes = require("./routes/gestorRoutes");
const authRoutes = require("./routes/authRoutes");
const { sequelize } = require("./models");
const createDatabaseIfNotExists = require("./db/initDb");
const seedAll = require("./seeders/seedAll");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de log de requisições
app.use((req, res, next) => {
  console.log(`Recebida requisição: ${req.method} ${req.url}`);
  next();
});

// Middleware
// Configurar o CORS para permitir requisições da origem do seu frontend
// Se o seu frontend estiver a correr em http://127.0.0.1:5500 ou http://localhost:5500
const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Se precisar de enviar cookies ou cabeçalhos de autorização
  optionsSuccessStatus: 204 // Para algumas requisições preflight
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api", pacienteRoutes);
app.use("/api", medicoRoutes);
app.use("/api", gestorRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Servidor Node.js com Express e Sequelize está a funcionar!");
});

// Função para iniciar o servidor após sincronizar a BD e popular dados iniciais
async function startServer() {
  try {
    console.log("A verificar/criar base de dados...");
    await createDatabaseIfNotExists();
    console.log("Base de dados verificada/criada.");

    console.log("A sincronizar modelos com a base de dados...");
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados com a base de dados.");

    console.log("A inserir dados iniciais (seeding) para todas as tabelas...");
    await seedAll();
    console.log("Seeding completo verificado/concluído.");

    app.listen(PORT, () => {
      console.log(`Servidor a correr na porta ${PORT}`);
      console.log(`Aceda em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
  }
}

// Iniciar o servidor
startServer();

module.exports = app;

