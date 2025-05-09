const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Calendario = sequelize.define("Calendario", {
    idCalendario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idCalendario"
    },
    Data: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "Data" // No diagrama, o campo é apenas "Data"
    },
    TipoEvento: {
      type: DataTypes.CHAR(1),
      allowNull: true, // Diagrama não especifica, assumindo que pode ser nulo ou ter um default
      field: "TipoEvento"
    },
    Descricao: {
      type: DataTypes.STRING(40), // Mantendo o tamanho assumido na análise
      allowNull: true,
      field: "Descricao"
    }
  }, {
    tableName: "Calendario",
    timestamps: false
  });

  Calendario.associate = (models) => {
    // Um Calendario pode estar associado a muitas Consultas
    Calendario.hasMany(models.Consulta, { foreignKey: "Calendario_idCalendario", as: "consultas" });
    // Um Calendario pode estar associado a muitos Pacientes (se Paciente tem Calendario_idCalendario)
    // Na análise do Paciente, foi incluído: Calendario_idCalendario INT (FK para Calendario.idCalendario)
    // No entanto, o diagrama do Paciente não mostra essa FK explicitamente, mas sim uma linha.
    // A tabela Paciente no diagrama tem: Endereco_idEndereco, Login_idLogin, QuestionarioSaude_idQuestionarioSaude, GestorAprovador_idGestor
    // A linha entre Paciente e Calendario pode indicar um relacionamento, mas a FK não está clara no Paciente.
    // Vamos assumir que a FK `Calendario_idCalendario` existe em Paciente, como interpretado anteriormente.
    // Se for o caso, a associação seria: Paciente.belongsTo(models.Calendario, ...)
    // E aqui: Calendario.hasMany(models.Paciente, { foreignKey: "Calendario_idCalendario", as: "pacientesAgendados" });
    // Contudo, o modelo Paciente já tem `Paciente.belongsTo(models.Calendario...` se essa FK existir lá.
    // A análise do Paciente.js precisa ser verificada. A análise do schema diz:
    // Paciente:
    // ...
    // Calendario_idCalendario INT (FK para Calendario.idCalendario)
    // Se essa FK está em Paciente, então Paciente `belongsTo` Calendario.
    // E Calendario `hasMany` Paciente.
    // O modelo Paciente.js gerado anteriormente *não* incluiu Calendario_idCalendario.
    // Preciso corrigir o modelo Paciente.js ou decidir como representar essa relação.
    // Olhando o diagrama novamente, a tabela Paciente tem uma FK `Calendario_idCalendario`.
    // Então, o modelo Paciente.js precisa ser atualizado para incluir essa FK e a associação.
    // E o modelo Calendario.js pode ter `hasMany` Pacientes.
  };

  return Calendario;
};
