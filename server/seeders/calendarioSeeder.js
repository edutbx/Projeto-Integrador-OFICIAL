const { Calendario } = require("../models");

const eventosCalendarioIniciais = [
  {
    Data: new Date("2024-06-10T10:00:00"),
    TipoEvento: "C", // C para Consulta
    Descricao: "Consulta Dr. House"
  },
  {
    Data: new Date("2024-06-10T14:30:00"),
    TipoEvento: "E", // E para Exame
    Descricao: "Exame de Sangue - LabX"
  },
  {
    Data: new Date("2024-06-11T09:00:00"),
    TipoEvento: "V", // V para Vacinação
    Descricao: "Vacina Gripe"
  },
  {
    Data: new Date("2024-06-12T16:00:00"),
    TipoEvento: "P", // P para Procedimento
    Descricao: "Pequena Cirurgia Ambulatorial"
  }
];

async function seedCalendario() {
  try {
    for (const eventoData of eventosCalendarioIniciais) {
      const [evento, created] = await Calendario.findOrCreate({
        where: { Data: eventoData.Data, Descricao: eventoData.Descricao }, // Evitar duplicados pela data e descrição
        defaults: eventoData
      });
      if (created) {
        console.log(`Evento de Calendário "${evento.Descricao}" em ${evento.Data.toISOString()} inserido com sucesso.`);
      } else {
        console.log(`Evento de Calendário "${evento.Descricao}" em ${evento.Data.toISOString()} já existe.`);
      }
    }
    console.log("Seeding de Calendário concluído.");
  } catch (error) {
    console.error("Erro ao inserir Eventos de Calendário iniciais:", error);
  }
}

module.exports = seedCalendario;
