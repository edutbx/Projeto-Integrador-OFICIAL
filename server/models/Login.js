const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Login = sequelize.define("Login", {
    idLogin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idLogin" // Explicit mapping, though often optional if names match
    },
    CPF: {
      type: DataTypes.STRING(15),
      allowNull: true, // Based on schema, assuming nullable if not specified as NOT NULL
      unique: true // CPF should ideally be unique
    },
    Senha: {
      type: DataTypes.STRING(255), // Storing hashed passwords, so length should be more than 10
      allowNull: false
    },
    TipoUsuario: {
      type: DataTypes.STRING(20), // e.g., 'paciente', 'medico', 'gestor'
      allowNull: false // Assuming this is a required field
    }
  }, {
    tableName: "Login",
    timestamps: false // Assuming no createdAt/updatedAt from the diagram
  });

  Login.associate = (models) => {
    Login.hasMany(models.AceiteTermo, { foreignKey: "Login_idLogin", as: "aceitesTermo" });
    Login.hasMany(models.Gestor, { foreignKey: "Login_idLogin", as: "gestores" });
    Login.hasMany(models.Paciente, { foreignKey: "Login_idLogin", as: "pacientes" });
    Login.hasMany(models.Medico, { foreignKey: "Login_idLogin", as: "medicos" });
  };

  return Login;
};
