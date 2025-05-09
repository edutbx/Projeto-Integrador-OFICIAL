const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Paciente = sequelize.define("Paciente", {
    idPaciente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idPaciente"
    },
    Nome: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    Telefone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    RG: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    DataNasc: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Sexo: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    Sobrenome: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    Endereco_idEndereco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Endereco",
        key: "idEndereco"
      }
    },
    Login_idLogin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Login",
        key: "idLogin"
      }
    },
    QuestionarioSaude_idQuestionarioSaude: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "QuestionarioSaude",
        key: "idQuestionarioSaude"
      }
    }
  }, {
    tableName: "Paciente",
    timestamps: false
  });

  Paciente.associate = (models) => {
    Paciente.belongsTo(models.Endereco, { foreignKey: "Endereco_idEndereco", as: "endereco" });
    Paciente.belongsTo(models.Login, { foreignKey: "Login_idLogin", as: "login" });
    Paciente.belongsTo(models.QuestionarioSaude, { foreignKey: "QuestionarioSaude_idQuestionarioSaude", as: "questionarioSaude" });
    Paciente.hasMany(models.Consulta, { foreignKey: "Paciente_idPaciente", as: "consultas" });
    Paciente.hasMany(models.Vacina, { foreignKey: "Paciente_idPaciente", as: "vacinas" });
  };

  return Paciente;
};
