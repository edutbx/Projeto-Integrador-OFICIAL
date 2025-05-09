const { PrescricaoMedicamento, Consulta, Medicamento, Medico, Paciente } = require("../models");

const prescricoesIniciais = [
  // Assumindo que a primeira Consulta (idConsulta=1) foi para Paciente ID 1 com Médico ID 1 (CRM SP12345)
  // Assumindo que o primeiro Medicamento (idMedicamento=1) é Paracetamol
  {
    Consulta_Medico_CRM: "SP12345",
    Consulta_Paciente_Email: "ana.silva@example.com",
    Consulta_DataHoraInicio: new Date("2024-06-10T10:00:00"),
    Medicamento_Nome: "Paracetamol",
    MedicoPrescritor_CRM: "SP12345", // CRM do médico que prescreveu (pode ser o mesmo da consulta)
    Dosagem: "1 comprimido de 500mg",
    Frequencia: "A cada 6 horas, se dor",
    DataPrescricao: new Date("2024-06-10T10:40:00"),
    DuracaoTratamento: "Enquanto houver dor"
  },
  // Assumindo que a segunda Consulta (idConsulta=2) foi para Paciente ID 2 com Médico ID 2 (CRM RJ54321)
  // Assumindo que o segundo Medicamento (idMedicamento=2) é Amoxicilina
  {
    Consulta_Medico_CRM: "RJ54321",
    Consulta_Paciente_Email: "bruno.costa@example.com",
    Consulta_DataHoraInicio: new Date("2024-06-11T11:00:00"),
    Medicamento_Nome: "Amoxicilina",
    MedicoPrescritor_CRM: "RJ54321",
    Dosagem: "5ml (250mg)",
    Frequencia: "A cada 8 horas",
    DataPrescricao: new Date("2024-06-11T11:25:00"),
    DuracaoTratamento: "7 dias"
  }
];

async function seedPrescricoesMedicamento() {
  try {
    for (const prescData of prescricoesIniciais) {
      const medicoConsulta = await Medico.findOne({ where: { CRM: prescData.Consulta_Medico_CRM } });
      const pacienteConsulta = await Paciente.findOne({ where: { Email: prescData.Consulta_Paciente_Email } });
      
      if (!medicoConsulta || !pacienteConsulta) {
        console.warn(`Médico ou Paciente da consulta não encontrado para prescrição. Pulando.`);
        continue;
      }

      const consultaInstance = await Consulta.findOne({
        where: {
          Medico_idMedico: medicoConsulta.idMedico,
          Paciente_idPaciente: pacienteConsulta.idPaciente,
          DataHoraInicio: prescData.Consulta_DataHoraInicio
        }
      });

      const medicamentoInstance = await Medicamento.findOne({ where: { NomeMedicamento: prescData.Medicamento_Nome } });
      const medicoPrescritorInstance = await Medico.findOne({ where: { CRM: prescData.MedicoPrescritor_CRM } });

      if (!consultaInstance) {
        console.warn(`Consulta para Médico CRM ${prescData.Consulta_Medico_CRM} e Paciente Email ${prescData.Consulta_Paciente_Email} em ${prescData.Consulta_DataHoraInicio.toISOString()} não encontrada. Pulando prescrição.`);
        continue;
      }
      if (!medicamentoInstance) {
        console.warn(`Medicamento "${prescData.Medicamento_Nome}" não encontrado. Pulando prescrição.`);
        continue;
      }
      if (!medicoPrescritorInstance) {
        console.warn(`Médico prescritor com CRM ${prescData.MedicoPrescritor_CRM} não encontrado. Pulando prescrição.`);
        continue;
      }

      const [prescricao, created] = await PrescricaoMedicamento.findOrCreate({
        where: { // Tentar encontrar por uma combinação única
          Consulta_idConsulta: consultaInstance.idConsulta,
          Medicamento_idMedicamento: medicamentoInstance.idMedicamento,
          Consulta_Medico_idMedico: medicoPrescritorInstance.idMedico // Usando o Medico_idMedico da prescrição
        },
        defaults: {
          Dosagem: prescData.Dosagem,
          Frequencia: prescData.Frequencia,
          DataPrescricao: prescData.DataPrescricao,
          DuracaoTratamento: prescData.DuracaoTratamento,
          Consulta_idConsulta: consultaInstance.idConsulta,
          Medicamento_idMedicamento: medicamentoInstance.idMedicamento,
          Consulta_Medico_idMedico: medicoPrescritorInstance.idMedico // FK para o médico que prescreveu
        }
      });

      if (created) {
        console.log(`Prescrição para Consulta ID ${consultaInstance.idConsulta}, Medicamento ID ${medicamentoInstance.idMedicamento} inserida com sucesso.`);
      } else {
        console.log(`Prescrição para Consulta ID ${consultaInstance.idConsulta}, Medicamento ID ${medicamentoInstance.idMedicamento} já existe.`);
      }
    }
    console.log("Seeding de Prescrições de Medicamento concluído.");
  } catch (error) {
    console.error("Erro ao inserir Prescrições de Medicamento iniciais:", error);
  }
}

module.exports = seedPrescricoesMedicamento;
