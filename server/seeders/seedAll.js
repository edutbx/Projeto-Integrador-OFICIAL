const seedTermosDeUso = require("./termoDeUsoSeeder");
const seedLogins = require("./loginSeeder");
const seedEnderecos = require("./enderecoSeeder");
const seedQuestionariosSaude = require("./questionarioSaudeSeeder");
const seedMedicamentos = require("./medicamentoSeeder");
const seedCalendario = require("./calendarioSeeder");
const seedExames = require("./exameSeeder");
const seedGestores = require("./gestorSeeder");
const seedAceitesTermo = require("./aceiteTermoSeeder");
const seedMedicos = require("./medicoSeeder");
const seedPacientes = require("./pacienteSeeder");
const seedConsultas = require("./consultaSeeder");
const seedVacinas = require("./vacinaSeeder");
const seedProntuarios = require("./prontuarioSeeder");
const seedPrescricoesMedicamento = require("./prescricaoMedicamentoSeeder");

async function seedAll() {
  console.log("Iniciando processo de seeding completo...");

  // Nível 1: Modelos sem ou com poucas dependências externas diretas
  await seedTermosDeUso();
  await seedLogins();
  await seedEnderecos();
  await seedQuestionariosSaude();
  await seedMedicamentos();
  await seedCalendario();
  await seedExames();

  // Nível 2: Modelos que dependem do Nível 1
  await seedGestores(); // Depende de Login
  await seedAceitesTermo(); // Depende de Login, TermoDeUso
  await seedMedicos(); // Depende de Login, Endereco, Gestor
  await seedPacientes(); // Depende de Login, Endereco, QuestionarioSaude

  // Nível 3: Modelos que dependem do Nível 2
  await seedConsultas(); // Depende de Medico, Paciente, Calendario
  await seedVacinas(); // Depende de Paciente

  // Nível 4: Modelos que dependem do Nível 3
  await seedProntuarios(); // Depende de Consulta, Exame
  await seedPrescricoesMedicamento(); // Depende de Consulta, Medicamento, Medico

  console.log("Processo de seeding completo finalizado.");
}

// Se este ficheiro for executado diretamente (ex: node seeders/seedAll.js)
if (require.main === module) {
  const { sequelize } = require("../models"); // Necessário para fechar a ligação se executado standalone
  seedAll()
    .then(() => {
      console.log("Seeding standalone concluído com sucesso.");
      return sequelize.close();
    })
    .catch(error => {
      console.error("Falha no seeding standalone:", error);
      return sequelize.close();
    });
}

module.exports = seedAll;
