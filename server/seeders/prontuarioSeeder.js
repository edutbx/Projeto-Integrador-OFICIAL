const { Prontuario, Consulta, Exame, Paciente, Medico } = require("../models");

const prontuariosIniciais = [
  // Assumindo que a primeira Consulta (idConsulta=1) foi para Paciente ID 1 com Médico ID 1
  // Assumindo que o primeiro Exame (idExame=1, Hemograma Completo) pode ser associado
  {
    Consulta_Medico_CRM: "SP12345", // Para buscar o Medico da Consulta
    Consulta_Paciente_Email: "ana.silva@example.com", // Para buscar o Paciente da Consulta
    Consulta_DataHoraInicio: new Date("2024-06-10T10:00:00"), // Para identificar a Consulta específica
    Queixa: "Dor de cabeça persistente há 3 dias.",
    ExameFisico: "Pressão arterial 120/80 mmHg, temperatura 36.5°C, ausculta pulmonar normal.",
    Diagnostico: "Cefaleia tensional. Recomenda-se repouso e analgésico se necessário.",
    Exame_Tipo_Data: { TipoExame: "Hemograma Completo", DataExame: new Date("2024-05-10T08:00:00") } // Opcional, para buscar o Exame
  },
  // Assumindo que a segunda Consulta (idConsulta=2) foi para Paciente ID 2 com Médico ID 2
  {
    Consulta_Medico_CRM: "RJ54321",
    Consulta_Paciente_Email: "bruno.costa@example.com",
    Consulta_DataHoraInicio: new Date("2024-06-11T11:00:00"),
    Queixa: "Check-up anual.",
    ExameFisico: "Bom estado geral, sem queixas ativas.",
    Diagnostico: "Paciente saudável. Manter hábitos saudáveis.",
    Exame_Tipo_Data: null // Exemplo sem exame associado
  }
];

async function seedProntuarios() {
  try {
    for (const prontuarioData of prontuariosIniciais) {
      const medicoConsulta = await Medico.findOne({ where: { CRM: prontuarioData.Consulta_Medico_CRM } });
      const pacienteConsulta = await Paciente.findOne({ where: { Email: prontuarioData.Consulta_Paciente_Email } });

      if (!medicoConsulta || !pacienteConsulta) {
        console.warn(`Médico ou Paciente da consulta não encontrado para prontuário. Pulando.`);
        continue;
      }

      const consultaInstance = await Consulta.findOne({
        where: {
          Medico_idMedico: medicoConsulta.idMedico,
          Paciente_idPaciente: pacienteConsulta.idPaciente,
          DataHoraInicio: prontuarioData.Consulta_DataHoraInicio
        }
      });

      if (!consultaInstance) {
        console.warn(`Consulta para Médico CRM ${prontuarioData.Consulta_Medico_CRM} e Paciente Email ${prontuarioData.Consulta_Paciente_Email} em ${prontuarioData.Consulta_DataHoraInicio.toISOString()} não encontrada. Pulando prontuário.`);
        continue;
      }

      let exameInstance = null;
      if (prontuarioData.Exame_Tipo_Data) {
        exameInstance = await Exame.findOne({
          where: {
            TipoExame: prontuarioData.Exame_Tipo_Data.TipoExame,
            DataExame: prontuarioData.Exame_Tipo_Data.DataExame
          }
        });
        if (!exameInstance) {
          console.warn(`Exame ${prontuarioData.Exame_Tipo_Data.TipoExame} não encontrado. O prontuário será criado sem exame associado.`);
        }
      }

      const [prontuario, created] = await Prontuario.findOrCreate({
        where: { Consulta_idConsulta: consultaInstance.idConsulta }, // Chave única para evitar duplicados
        defaults: {
          DataHoraRegistro: new Date(), // Pode ser a data da consulta ou data atual
          Queixa: prontuarioData.Queixa,
          ExameFisico: prontuarioData.ExameFisico,
          Diagnostico: prontuarioData.Diagnostico,
          Consulta_idConsulta: consultaInstance.idConsulta,
          Exame_idExame: exameInstance ? exameInstance.idExame : null
        }
      });

      if (created) {
        console.log(`Prontuário para Consulta ID ${consultaInstance.idConsulta} inserido com sucesso.`);
      } else {
        console.log(`Prontuário para Consulta ID ${consultaInstance.idConsulta} já existe.`);
      }
    }
    console.log("Seeding de Prontuários concluído.");
  } catch (error) {
    console.error("Erro ao inserir Prontuários iniciais:", error);
  }
}

module.exports = seedProntuarios;
