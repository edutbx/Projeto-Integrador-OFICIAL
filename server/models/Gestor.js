const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Gestor = sequelize.define("Gestor", {
    idGestor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idGestor"
    },
    Nome: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    CPF: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    Cargo: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Login_idLogin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Login",
        key: "idLogin"
      }
    }
  }, {
    tableName: "Gestor",
    timestamps: false
  });

  Gestor.associate = (models) => {
    Gestor.belongsTo(models.Login, { foreignKey: "Login_idLogin", as: "login" });
    // Assuming a Gestor can approve multiple Medicos and Pacientes, based on Medico and Paciente tables
    Gestor.hasMany(models.Medico, { foreignKey: "GestorAprovador_idGestor", as: "medicosAprovados" });
    Gestor.hasMany(models.Paciente, { foreignKey: "GestorAprovador_idGestor", as: "pacientesAprovados" });
  };

  return Gestor;
};
