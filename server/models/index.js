const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { sequelize } = require("../db/connection"); // Import the sequelize instance

const db = {};

// Ler todos os ficheiros na pasta models, exceto este (index.js)
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) && // Não incluir o próprio index.js
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    console.log(`Modelo ${model.name} carregado a partir de models/index.js.`);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    console.log(`Associações para o modelo ${modelName} configuradas a partir de models/index.js.`);
  }
});

db.sequelize = sequelize; // Adicionar a instância do sequelize ao objeto db
db.Sequelize = Sequelize; // Adicionar a classe Sequelize ao objeto db

module.exports = db;
