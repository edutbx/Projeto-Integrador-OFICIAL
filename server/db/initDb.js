const mysql = require("mysql2/promise");
require("dotenv").config({ path: "../.env" }); // Ajustar o caminho para o .env

async function createDatabaseIfNotExists() {
  let connection;
  try {
    // Ligação inicial sem especificar a base de dados, para poder criá-la
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    const dbName = process.env.DB_NAME;
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Base de dados "${dbName}" verificada/criada com sucesso.`);

  } catch (error) {
    console.error("Erro ao criar/verificar a base de dados:", error);
    // Lançar o erro para que o processo principal saiba que algo correu mal
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Exportar a função para que possa ser chamada antes de iniciar o Sequelize
module.exports = createDatabaseIfNotExists;

// Se este ficheiro for executado diretamente (ex: node db/initDb.js), executa a função
if (require.main === module) {
  createDatabaseIfNotExists().catch(error => {
    console.error("Falha na inicialização da base de dados:", error);
    process.exit(1); // Sair com código de erro se a criação da BD falhar
  });
}
