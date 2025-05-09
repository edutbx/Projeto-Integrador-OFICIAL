const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AceiteTermo = sequelize.define("AceiteTermo", {
    idAceiteTermo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idAceiteTermo"
    },
    DataHoraAceite: {
      type: DataTypes.DATE,
      allowNull: false
    },
    // Login_idLogin will be added by the association
    // TermoDeUso_idTermoDeUso will be added by the association
  }, {
    tableName: "AceiteTermo",
    timestamps: false
  });

  AceiteTermo.associate = (models) => {
    AceiteTermo.belongsTo(models.Login, { foreignKey: "Login_idLogin", as: "login" });
    AceiteTermo.belongsTo(models.TermoDeUso, { foreignKey: "TermoDeUso_idTermoDeUso", as: "termoDeUso" });
  };

  return AceiteTermo;
};
