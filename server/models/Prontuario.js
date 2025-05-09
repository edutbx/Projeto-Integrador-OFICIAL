const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Prontuario = sequelize.define("Prontuario", {
    idProntuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idProntuario"
    },
    DataHoraRegistro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Assuming registration time defaults to now
    },
    Queixa: {
      type: DataTypes.TEXT("tiny"),
      allowNull: true
    },
    ExameFisico: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Diagnostico: {
      type: DataTypes.TEXT("tiny"),
      allowNull: true
    },
    Consulta_idConsulta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Consulta",
        key: "idConsulta"
      }
    },
    // As per diagram analysis, Prontuario might reference an Exame.
    // Adding an optional Exame_idExame foreign key.
    Exame_idExame: {
        type: DataTypes.INTEGER,
        allowNull: true, // Assuming an exam is optional for a prontuario entry
        references: {
            model: "Exame",
            key: "idExame"
        }
    }
  }, {
    tableName: "Prontuario",
    timestamps: false
  });

  Prontuario.associate = (models) => {
    Prontuario.belongsTo(models.Consulta, { foreignKey: "Consulta_idConsulta", as: "consulta" });
    Prontuario.belongsTo(models.Exame, { foreignKey: "Exame_idExame", as: "exame", onDelete: 'SET NULL', onUpdate: 'CASCADE' }); // Optional FK
  };

  return Prontuario;
};
