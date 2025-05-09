const { Vacina, Paciente } = require("../models");

const vacinasIniciais = [
  // Assumindo que o Paciente com Email ana.silva@example.com (idPaciente=1) tomou vacinas
  {
    Paciente_Email: "ana.silva@example.com",
    NomeVacina: "Hepatite B (Recomb)",
    DataAplicacao: new Date("2023-01-15T10:00:00"),
    Lote: "HB2023001",
    LocalAplicacao: "Posto de Saúde Central",
    // Comprovante: null // BLOB, pode ser deixado como null
  },
  {
    Paciente_Email: "ana.silva@example.com",
    NomeVacina: "Gripe (Influenza)",
    DataAplicacao: new Date("2024-04-20T14:30:00"),
    Lote: "FLU2024XYZ",
    LocalAplicacao: "Clínica Imunize Já",
    // Comprovante: null
  },
  // Assumindo que o Paciente com Email bruno.costa@example.com (idPaciente=2) tomou uma vacina
  {
    Paciente_Email: "bruno.costa@example.com",
    NomeVacina: "COVID-19 Pfizer (Dose 1)",
    DataAplicacao: new Date("2023-08-10T09:00:00"),
    Lote: "PFZ12345A",
    LocalAplicacao: "Drive-Thru Vacinação Municipal",
    // Comprovante: null
  }
];

async function seedVacinas() {
  try {
    for (const vacinaData of vacinasIniciais) {
      const pacienteInstance = await Paciente.findOne({ where: { Email: vacinaData.Paciente_Email } });

      if (!pacienteInstance) {
        console.warn(`Paciente com Email ${vacinaData.Paciente_Email} não encontrado para a vacina "${vacinaData.NomeVacina}". Pulando.`);
        continue;
      }

      const [vacina, created] = await Vacina.findOrCreate({
        where: { // Tentar encontrar por uma combinação única
          Paciente_idPaciente: pacienteInstance.idPaciente,
          NomeVacina: vacinaData.NomeVacina,
          DataAplicacao: vacinaData.DataAplicacao
        },
        defaults: {
          NomeVacina: vacinaData.NomeVacina,
          DataAplicacao: vacinaData.DataAplicacao,
          Lote: vacinaData.Lote,
          LocalAplicacao: vacinaData.LocalAplicacao,
          Comprovante: vacinaData.Comprovante, // Será null se não fornecido
          Paciente_idPaciente: pacienteInstance.idPaciente
        }
      });

      if (created) {
        console.log(`Vacina "${vacina.NomeVacina}" para Paciente ID ${pacienteInstance.idPaciente} em ${vacina.DataAplicacao.toISOString()} inserida com sucesso.`);
      } else {
        console.log(`Vacina "${vacina.NomeVacina}" para Paciente ID ${pacienteInstance.idPaciente} em ${vacina.DataAplicacao.toISOString()} já existe.`);
      }
    }
    console.log("Seeding de Vacinas concluído.");
  } catch (error) {
    console.error("Erro ao inserir Vacinas iniciais:", error);
  }
}

module.exports = seedVacinas;
