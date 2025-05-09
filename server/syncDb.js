const fs = require("fs");
const path = require("path");
const { sequelize } = require("./db/connection"); // Sequelize instance
const createDatabaseIfNotExists = require("./db/initDb");

const modelsDir = path.join(__dirname, "models");

async function syncDatabase() {
  try {
    // 1. Garantir que a base de dados exista
    await createDatabaseIfNotExists();
    console.log("Verificação/criação da base de dados concluída.");

    // 2. Carregar e inicializar todos os modelos da pasta 'models'
    fs.readdirSync(modelsDir)
      .filter(file => file.indexOf(".") !== 0 && file.slice(-3) === ".js")
      .forEach(file => {
        const model = require(path.join(modelsDir, file))(sequelize);
        db[model.name] = model;
        console.log(`Modelo ${model.name} carregado.`);
      });

    // Associar modelos, se houver funções de associação definidas
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
        console.log(`Associações para o modelo ${modelName} configuradas.`);
      }
    });

    // 3. Sincronizar todos os modelos com a base de dados (criar tabelas)
    // Usar { alter: true } pode ser mais seguro para desenvolvimento, pois tenta alterar tabelas existentes para corresponder ao modelo sem apagar dados.
    // Usar { force: true } apaga as tabelas existentes e recria-as (PERDA DE DADOS).
    // Para a criação inicial, um sync() simples ou com alter:true é geralmente bom.
    await sequelize.sync({ alter: true }); // ou sequelize.sync() se preferir não alterar tabelas existentes
    console.log("Todos os modelos foram sincronizados com sucesso e as tabelas foram criadas/atualizadas!");

  } catch (error) {
    console.error("Erro ao sincronizar a base de dados e criar tabelas:", error);
    process.exit(1); // Sair com erro se a sincronização falhar
  } finally {
    await sequelize.close();
    console.log("Ligação à base de dados fechada.");
  }
}

const db = {}; // Objeto para armazenar os modelos carregados

// Executar a sincronização
syncDatabase();

