const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Exame = sequelize.define("Exame", {
    idExame: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "idExame"
    },
    TipoExame: {
      type: DataTypes.STRING(45),
      allowNull: false // Assuming TipoExame is required
    },
    DataExame: {
      type: DataTypes.DATE,
      allowNull: false // Assuming DataExame is required
    },
    Arquivo: {
      type: DataTypes.BLOB,
      allowNull: true // Arquivo (e.g., PDF, image) might be optional
    }
    // Note: The diagram shows relationships to Prontuario, but no direct FK field in Exame table itself.
    // This suggests Exame might be referenced by Prontuario (e.g., Prontuario has an Exame_idExame).
    // Or it could be a many-to-many relationship via a join table if not directly linked.
    // For now, we define Exame and will handle its association from Prontuario or a join table model if needed.
  }, {
    tableName: "Exame",
    timestamps: false
  });

  Exame.associate = (models) => {
    // If Prontuario has a FK to Exame (e.g., Exame_idExame in Prontuario)
    // Exame.hasMany(models.Prontuario, { foreignKey: "Exame_idExame", as: "prontuarios" });
    // Based on the diagram, it seems Prontuario might link to Consulta, and Consulta to Exame is not directly shown as a FK in Consulta.
    // The line between Exame and Prontuario suggests a link. The `database_schema_analysis.md` noted:
    // "*Relacionamentos a serem confirmados, possivelmente com Prontuario.*"
    // And for Prontuario: "*Possível relacionamento com Exame (Exame_idExame) não listado explicitamente nos campos, mas indicado por linhas no diagrama.*"
    // Let's assume for now that Prontuario will have an `Exame_idExame` foreign key.
    // This will be defined in Prontuario's associations.
  };

  return Exame;
};
