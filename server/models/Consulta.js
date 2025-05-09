const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Consulta = sequelize.define("Consulta", {
    idConsulta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idConsulta"
    },
    DataHoraInicio: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "DataHoraInicio"
    },
    DataHoraFinal: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "DataHoraFinal"
    },
    Observacao: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "Observacao"
    },
    StatusConsulta: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "StatusConsulta"
    },
    Medico_idMedico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Medico",
        key: "idMedico"
      },
      field: "Medico_idMedico"
    },
    Paciente_idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Paciente",
        key: "idPaciente"
      },
      field: "Paciente_idPaciente"
    },
    Calendario_idCalendario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Calendario",
        key: "idCalendario"
      },
      field: "Calendario_idCalendario"
    }
  }, {
    tableName: "Consulta",
    timestamps: false
  });

  Consulta.associate = (models) => {
    Consulta.belongsTo(models.Medico, { foreignKey: "Medico_idMedico", as: "medico" });
    Consulta.belongsTo(models.Paciente, { foreignKey: "Paciente_idPaciente", as: "paciente" });
    Consulta.belongsTo(models.Calendario, { foreignKey: "Calendario_idCalendario", as: "calendario" });
    Consulta.hasMany(models.PrescricaoMedicamento, { foreignKey: "Consulta_idConsulta", as: "prescricoesMedicamento" });
  };

  return Consulta;
};
