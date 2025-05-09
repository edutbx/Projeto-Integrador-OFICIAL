const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Defina como true para ver os logs SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Testar a ligação
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Ligação à base de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível ligar à base de dados:', error);
  }
}

testConnection();

module.exports = db;
