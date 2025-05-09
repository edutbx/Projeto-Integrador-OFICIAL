const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Medicamento = sequelize.define("Medicamento", {
    idMedicamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idMedicamento"
    },
    NomeMedicamento: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    FormaFarmaceutica: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Concentracao: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Fabricante: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ObservacaoCatalogo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: "Medicamento",
    timestamps: false
  });

  Medicamento.associate = (models) => {
    Medicamento.hasMany(models.PrescricaoMedicamento, { foreignKey: "Medicamento_idMedicamento", as: "prescricoes" });
  };

  return Medicamento;
};
