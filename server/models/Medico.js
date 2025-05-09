const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Medico = sequelize.define("Medico", {
    idMedico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idMedico"
    },
    Nome: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Sobrenome: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    CPF: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    RG: {
      type: DataTypes.STRING(12),
      allowNull: true // Assuming RG can be nullable based on common practice
    },
    CRM: {
      type: DataTypes.STRING(10),
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
    Especializacao: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Login_idLogin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Login",
        key: "idLogin"
      }
    },
    Endereco_idEndereco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Endereco",
        key: "idEndereco"
      }
    },
    GestorAprovador_idGestor: {
      type: DataTypes.INTEGER,
      allowNull: true, // Assuming a doctor might not need immediate approval or could be self-registered initially
      references: {
        model: "Gestor",
        key: "idGestor"
      }
    }
  }, {
    tableName: "Medico",
    timestamps: false
  });

  Medico.associate = (models) => {
    Medico.belongsTo(models.Login, { foreignKey: "Login_idLogin", as: "login" });
    Medico.belongsTo(models.Endereco, { foreignKey: "Endereco_idEndereco", as: "endereco" });
    Medico.belongsTo(models.Gestor, { foreignKey: "GestorAprovador_idGestor", as: "gestorAprovador" });
    Medico.hasMany(models.Consulta, { foreignKey: "Medico_idMedico", as: "consultas" });
    // Association with PrescricaoMedicamento also exists via Consulta_Medico_idMedico, but direct might be redundant if always through Consulta
    // However, the diagram shows a direct FK from PrescricaoMedicamento to Medico (Consulta_Medico_idMedico)
    // This implies a Medico can have Prescricoes. Let's assume it's linked via Consulta for now, or it's a denormalized FK.
    // For simplicity, we'll stick to the direct FKs shown in the table structure for `belongsTo` and `hasMany` based on primary usage.
    // The PrescricaoMedicamento model will handle its belongsTo Medico.
  };

  return Medico;
};
