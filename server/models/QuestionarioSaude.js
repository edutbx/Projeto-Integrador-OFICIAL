const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const QuestionarioSaude = sequelize.define("QuestionarioSaude", {
    idQuestionarioSaude: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idQuestionarioSaude"
    },
    PreCondicao: {
      type: DataTypes.CHAR(1),
      allowNull: true // Assumindo que pode ser nulo, ou ter um valor padrão (ex: 'N')
    },
    Alergia: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    Cirurgia: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    Alcool: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    Fuma: {
      type: DataTypes.CHAR(1),
      allowNull: true
    }
  }, {
    tableName: "QuestionarioSaude",
    timestamps: false
  });

  QuestionarioSaude.associate = (models) => {
    QuestionarioSaude.hasMany(models.Paciente, { foreignKey: "QuestionarioSaude_idQuestionarioSaude", as: "pacientes" });
  };

  return QuestionarioSaude;
};
