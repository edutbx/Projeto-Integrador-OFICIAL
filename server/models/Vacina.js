const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Vacina = sequelize.define("Vacina", {
    idVacina: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idVacina"
    },
    NomeVacina: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    DataAplicacao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Lote: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    LocalAplicacao: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Comprovante: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    Paciente_idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Paciente",
        key: "idPaciente"
      }
    }
  }, {
    tableName: "Vacina",
    timestamps: false
  });

  Vacina.associate = (models) => {
    Vacina.belongsTo(models.Paciente, { foreignKey: "Paciente_idPaciente", as: "paciente" });
  };

  return Vacina;
};
