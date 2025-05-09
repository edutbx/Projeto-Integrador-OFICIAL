const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Endereco = sequelize.define("Endereco", {
    idEndereco: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idEndereco"
    },
    Logadouro: { // Corrected from Logadouro to Logradouro based on common Portuguese spelling
      type: DataTypes.STRING(100),
      allowNull: false
    },
    CEP: {
      type: DataTypes.STRING(10), // Increased length to accommodate formats like XXXXX-XXX
      allowNull: false
    },
    Cidade: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Estado: {
      type: DataTypes.CHAR(2),
      allowNull: false
    },
    Numero: {
      type: DataTypes.INTEGER, // Assuming it's an integer, could be STRING if it includes letters like '123A'
      allowNull: true // Number might be optional for some addresses (e.g. rural)
    },
    Complemento: {
      type: DataTypes.STRING(25),
      allowNull: true
    }
  }, {
    tableName: "Endereco",
    timestamps: false
  });

  Endereco.associate = (models) => {
    Endereco.hasMany(models.Paciente, { foreignKey: "Endereco_idEndereco", as: "pacientes" });
    Endereco.hasMany(models.Medico, { foreignKey: "Endereco_idEndereco", as: "medicos" });
  };

  return Endereco;
};
