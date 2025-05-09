const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PrescricaoMedicamento = sequelize.define("PrescricaoMedicamento", {
    idPrescricaoMedicamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idPrescricaoMedicamento"
    },
    Dosagem: {
      type: DataTypes.STRING(30),
      allowNull: true // Diagrama não especifica, assumindo opcional
    },
    Frequencia: {
      type: DataTypes.STRING(30),
      allowNull: true // Diagrama não especifica, assumindo opcional
    },
    DataPrescricao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    DuracaoTratamento: {
      type: DataTypes.STRING(30),
      allowNull: true // Diagrama não especifica, assumindo opcional
    },
    Consulta_idConsulta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Consulta",
        key: "idConsulta"
      }
    },
    // O diagrama mostra Consulta_Medico_idMedico, o que é um pouco incomum se Consulta já tem Medico_idMedico.
    // Isso pode ser uma denormalização para acesso rápido ou um erro no diagrama.
    // Se Consulta_idConsulta já vincula a uma consulta específica (que tem um médico), este campo pode ser redundante.
    // No entanto, seguindo o diagrama estritamente:
    Consulta_Medico_idMedico: {
        type: DataTypes.INTEGER,
        allowNull: false, // Se presente no diagrama como FK, geralmente é non-null
        references: {
            model: "Medico", // Referencia direta a Medico, não à tabela Consulta para o médico.
            key: "idMedico"
        }
    },
    Medicamento_idMedicamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Medicamento",
        key: "idMedicamento"
      }
    }
  }, {
    tableName: "PrescricaoMedicamento",
    timestamps: false
  });

  PrescricaoMedicamento.associate = (models) => {
    PrescricaoMedicamento.belongsTo(models.Consulta, { foreignKey: "Consulta_idConsulta", as: "consulta" });
    PrescricaoMedicamento.belongsTo(models.Medicamento, { foreignKey: "Medicamento_idMedicamento", as: "medicamento" });
    // Associação para Consulta_Medico_idMedico
    PrescricaoMedicamento.belongsTo(models.Medico, { foreignKey: "Consulta_Medico_idMedico", as: "medicoPrescritor" });
  };

  return PrescricaoMedicamento;
};
