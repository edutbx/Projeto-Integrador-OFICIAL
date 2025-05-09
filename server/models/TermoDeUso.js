const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TermoDeUso = sequelize.define("TermoDeUso", {
    idTermoDeUso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idTermoDeUso"
    },
    NumeroVersao: {
      type: DataTypes.DECIMAL,
      allowNull: true // Baseado na análise, se não especificado como NOT NULL
    },
    TituloTermo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Texto: {
      type: DataTypes.TEXT("medium"), // MEDIUMTEXT
      allowNull: true
    },
    DataPublicacao: {
      type: DataTypes.DATEONLY, // Apenas DATE
      allowNull: true
    },
    DescricaoAlteracao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    TipoTermo: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    tableName: "TermoDeUso",
    timestamps: false
  });

  TermoDeUso.associate = (models) => {
    TermoDeUso.hasMany(models.AceiteTermo, { foreignKey: "TermoDeUso_idTermoDeUso", as: "aceitesTermo" });
  };

  return TermoDeUso;
};
