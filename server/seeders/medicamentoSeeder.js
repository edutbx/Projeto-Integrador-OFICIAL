const { Medicamento } = require("../models"); // Ajuste o caminho conforme a sua estrutura

const medicamentosIniciais = [
  {
    NomeMedicamento: "Paracetamol",
    FormaFarmaceutica: "Comprimido",
    Concentracao: "500mg",
    Fabricante: "Genérico Pharma",
    ObservacaoCatalogo: "Analgésico e antipirético."
  },
  {
    NomeMedicamento: "Amoxicilina",
    FormaFarmaceutica: "Suspensão Oral",
    Concentracao: "250mg/5ml",
    Fabricante: "Medley",
    ObservacaoCatalogo: "Antibiótico de amplo espectro."
  },
  {
    NomeMedicamento: "Dipirona Sódica",
    FormaFarmaceutica: "Gotas",
    Concentracao: "500mg/ml",
    Fabricante: "EMS",
    ObservacaoCatalogo: "Analgésico e antipirético. Uso adulto e pediátrico acima de 3 meses."
  },
  {
    NomeMedicamento: "Omeprazol",
    FormaFarmaceutica: "Cápsula",
    Concentracao: "20mg",
    Fabricante: "Neo Química",
    ObservacaoCatalogo: "Inibidor de bomba de prótons, para tratamento de gastrite e refluxo."
  },
  {
    NomeMedicamento: "Loratadina",
    FormaFarmaceutica: "Comprimido",
    Concentracao: "10mg",
    Fabricante: "Cimed",
    ObservacaoCatalogo: "Anti-histamínico para alívio de sintomas de alergia."
  }
];

async function seedMedicamentos() {
  try {
    for (const medData of medicamentosIniciais) {
      // Verifica se o medicamento já existe pelo nome para evitar duplicados
      const [medicamento, created] = await Medicamento.findOrCreate({
        where: { NomeMedicamento: medData.NomeMedicamento },
        defaults: medData
      });
      if (created) {
        console.log(`Medicamento "${medicamento.NomeMedicamento}" inserido com sucesso.`);
      } else {
        console.log(`Medicamento "${medicamento.NomeMedicamento}" já existe. Não foi inserido.`);
      }
    }
    console.log("Seeding de medicamentos concluído.");
  } catch (error) {
    console.error("Erro ao inserir medicamentos iniciais:", error);
  }
}

module.exports = seedMedicamentos;
