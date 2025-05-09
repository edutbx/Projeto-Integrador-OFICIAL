const { Consulta, Medico, Paciente, Calendario } = require("../models");

const consultasIniciais = [
  // Assumindo Medico com CRM SP12345 (idMedico=1)
  // Assumindo Paciente com Email ana.silva@example.com (idPaciente=1)
  // Assumindo Calendario com Data 2024-06-10T10:00:00 e Descricao "Consulta Dr. House" (idCalendario=1)
  {
    DataHoraInicio: new Date("2024-06-10T10:00:00"),
    DataHoraFinal: new Date("2024-06-10T10:45:00"),
    Observacao: "Paciente queixa-se de dores de cabeça frequentes.",
    StatusConsulta: "Realizada",
    Medico_CRM: "SP12345",
    Paciente_Email: "ana.silva@example.com",
    Calendario_Data_Descricao: { Data: new Date("2024-06-10T10:00:00"), Descricao: "Consulta Dr. House" }
  },
  // Assumindo Medico com CRM RJ54321 (idMedico=2)
  // Assumindo Paciente com Email bruno.costa@example.com (idPaciente=2)
  // Assumindo Calendario com Data 2024-06-11T09:00:00 e Descricao "Vacina Gripe" (idCalendario=3) - Note: Calendario pode ser para consulta também
  {
    DataHoraInicio: new Date("2024-06-11T11:00:00"),
    DataHoraFinal: new Date("2024-06-11T11:30:00"),
    Observacao: "Consulta de rotina, paciente apresenta bom estado geral.",
    StatusConsulta: "Agendada",
    Medico_CRM: "RJ54321",
    Paciente_Email: "bruno.costa@example.com",
    Calendario_Data_Descricao: { Data: new Date("2024-06-11T09:00:00"), Descricao: "Vacina Gripe" } // Exemplo, idealmente seria um evento de calendário para a consulta
  }
];

async function seedConsultas() {
  try {
    for (const consultaData of consultasIniciais) {
      const medicoInstance = await Medico.findOne({ where: { CRM: consultaData.Medico_CRM } });
      const pacienteInstance = await Paciente.findOne({ where: { Email: consultaData.Paciente_Email } });
      const calendarioInstance = await Calendario.findOne({
        where: {
          Data: consultaData.Calendario_Data_Descricao.Data,
          Descricao: consultaData.Calendario_Data_Descricao.Descricao
        }
      });

      if (!medicoInstance) {
        console.warn(`Médico com CRM ${consultaData.Medico_CRM} não encontrado para a consulta. Pulando.`);
        continue;
      }
      if (!pacienteInstance) {
        console.warn(`Paciente com Email ${consultaData.Paciente_Email} não encontrado para a consulta. Pulando.`);
        continue;
      }
      if (!calendarioInstance) {
        console.warn(`Evento de Calendário para ${consultaData.Calendario_Data_Descricao.Descricao} não encontrado. Pulando.`);
        continue;
      }

      const [consulta, created] = await Consulta.findOrCreate({
        where: { // Tentar encontrar por uma combinação única, se possível
          Medico_idMedico: medicoInstance.idMedico,
          Paciente_idPaciente: pacienteInstance.idPaciente,
          DataHoraInicio: consultaData.DataHoraInicio
        },
        defaults: {
          DataHoraInicio: consultaData.DataHoraInicio,
          DataHoraFinal: consultaData.DataHoraFinal,
          Observacao: consultaData.Observacao,
          StatusConsulta: consultaData.StatusConsulta,
          Medico_idMedico: medicoInstance.idMedico,
          Paciente_idPaciente: pacienteInstance.idPaciente,
          Calendario_idCalendario: calendarioInstance.idCalendario
        }
      });

      if (created) {
        console.log(`Consulta para Paciente ID ${pacienteInstance.idPaciente} com Médico ID ${medicoInstance.idMedico} em ${consulta.DataHoraInicio.toISOString()} inserida com sucesso.`);
      } else {
        console.log(`Consulta para Paciente ID ${pacienteInstance.idPaciente} com Médico ID ${medicoInstance.idMedico} em ${consulta.DataHoraInicio.toISOString()} já existe.`);
      }
    }
    console.log("Seeding de Consultas concluído.");
  } catch (error) {
    console.error("Erro ao inserir Consultas iniciais:", error);
  }
}

module.exports = seedConsultas;
