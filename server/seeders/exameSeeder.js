const { Exame } = require("../models");

const examesIniciais = [
  {
    TipoExame: "Hemograma Completo",
    DataExame: new Date("2024-05-10T08:00:00"),
    // Arquivo: null // Arquivo é BLOB, pode ser deixado como null ou preenchido com Buffer de um ficheiro se necessário
  },
  {
    TipoExame: "Raio-X do Tórax",
    DataExame: new Date("2024-05-11T14:00:00"),
    // Arquivo: null
  },
  {
    TipoExame: "Glicemia de Jejum",
    DataExame: new Date("2024-05-12T07:30:00"),
    // Arquivo: null
  },
  {
    TipoExame: "Eletrocardiograma (ECG)",
    DataExame: new Date("2024-05-12T10:00:00"),
    // Arquivo: null
  }
];

async function seedExames() {
  try {
    for (const exameData of examesIniciais) {
      const [exame, created] = await Exame.findOrCreate({
        where: { TipoExame: exameData.TipoExame, DataExame: exameData.DataExame }, // Evitar duplicados pelo tipo e data
        defaults: exameData
      });
      if (created) {
        console.log(`Exame "${exame.TipoExame}" de ${exame.DataExame.toISOString()} inserido com sucesso.`);
      } else {
        console.log(`Exame "${exame.TipoExame}" de ${exame.DataExame.toISOString()} já existe.`);
      }
    }
    console.log("Seeding de Exames concluído.");
  } catch (error) {
    console.error("Erro ao inserir Exames iniciais:", error);
  }
}

module.exports = seedExames;
