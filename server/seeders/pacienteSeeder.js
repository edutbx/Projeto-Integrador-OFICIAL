const { Paciente, Login, Endereco, QuestionarioSaude } = require("../models");

const pacientesIniciais = [
  // Assumindo que o Login com CPF '111.222.333-44' (Tipo: paciente) terá idLogin = 1
  // Assumindo que o primeiro Endereco inserido terá idEndereco = 1
  // Assumindo que o primeiro QuestionarioSaude inserido terá idQuestionarioSaude = 1
  {
    Nome: "Ana",
    Sobrenome: "Silva",
    Email: "ana.silva@example.com",
    Telefone: "11987654321",
    RG: "12.345.678-9",
    DataNasc: "1995-08-23",
    Sexo: "F",
    Login_idLogin_CPF: "111.222.333-44",
    Endereco_idEndereco_CEP_Numero: { CEP: "01001-000", Numero: 123 },
    QuestionarioSaude_idQuestionarioSaude_Index: 0 // Usar índice para pegar o primeiro questionário do array no seeder de QuestionarioSaude
  },
  // Assumindo que o Login com CPF '222.333.444-55' (Tipo: paciente) terá idLogin = 2
  // Assumindo que o segundo Endereco inserido terá idEndereco = 2
  // Assumindo que o segundo QuestionarioSaude inserido terá idQuestionarioSaude = 2
  {
    Nome: "Bruno",
    Sobrenome: "Costa",
    Email: "bruno.costa@example.com",
    Telefone: "21912345678",
    RG: "23.456.789-0",
    DataNasc: "1988-02-10",
    Sexo: "M",
    Login_idLogin_CPF: "222.333.444-55",
    Endereco_idEndereco_CEP_Numero: { CEP: "20040-030", Numero: 456 },
    QuestionarioSaude_idQuestionarioSaude_Index: 1 // Usar índice para pegar o segundo questionário
  }
];

// Dados de exemplo do questionarioSaudeSeeder.js para referência de índice
const questionariosBase = [
  { PreCondicao: "S", Alergia: "N", Cirurgia: "S", Alcool: "N", Fuma: "N" },
  { PreCondicao: "N", Alergia: "S", Cirurgia: "N", Alcool: "S", Fuma: "S" },
  { PreCondicao: "N", Alergia: "N", Cirurgia: "N", Alcool: "N", Fuma: "N" },
  { PreCondicao: "S", Alergia: "S", Cirurgia: "S", Alcool: "S", Fuma: "N" }
];

async function seedPacientes() {
  try {
    for (const pacienteData of pacientesIniciais) {
      const loginInstance = await Login.findOne({ where: { CPF: pacienteData.Login_idLogin_CPF } });
      const enderecoInstance = await Endereco.findOne({ 
        where: { 
          CEP: pacienteData.Endereco_idEndereco_CEP_Numero.CEP, 
          Numero: pacienteData.Endereco_idEndereco_CEP_Numero.Numero 
        }
      });
      
      // Buscar QuestionarioSaude pelos dados exatos do índice fornecido
      const qsDataRef = questionariosBase[pacienteData.QuestionarioSaude_idQuestionarioSaude_Index];
      const questionarioInstance = await QuestionarioSaude.findOne({
        where: {
            PreCondicao: qsDataRef.PreCondicao,
            Alergia: qsDataRef.Alergia,
            Cirurgia: qsDataRef.Cirurgia,
            Alcool: qsDataRef.Alcool,
            Fuma: qsDataRef.Fuma
        }
      });

      if (!loginInstance) {
        console.warn(`Login com CPF ${pacienteData.Login_idLogin_CPF} não encontrado para o paciente ${pacienteData.Nome}. Pulando.`);
        continue;
      }
      if (!enderecoInstance) {
        console.warn(`Endereço com CEP ${pacienteData.Endereco_idEndereco_CEP_Numero.CEP} e Número ${pacienteData.Endereco_idEndereco_CEP_Numero.Numero} não encontrado para o paciente ${pacienteData.Nome}. Pulando.`);
        continue;
      }
      if (!questionarioInstance) {
        console.warn(`Questionário de Saúde (índice ${pacienteData.QuestionarioSaude_idQuestionarioSaude_Index}) não encontrado para o paciente ${pacienteData.Nome}. Verifique se o questionarioSaudeSeeder foi executado e os dados correspondem. Pulando.`);
        continue;
      }

      const [paciente, created] = await Paciente.findOrCreate({
        where: { Email: pacienteData.Email }, // Usar Email como chave única para evitar duplicados
        defaults: {
          Nome: pacienteData.Nome,
          Sobrenome: pacienteData.Sobrenome,
          Email: pacienteData.Email,
          Telefone: pacienteData.Telefone,
          RG: pacienteData.RG,
          DataNasc: pacienteData.DataNasc,
          Sexo: pacienteData.Sexo,
          Login_idLogin: loginInstance.idLogin,
          Endereco_idEndereco: enderecoInstance.idEndereco,
          QuestionarioSaude_idQuestionarioSaude: questionarioInstance.idQuestionarioSaude
        }
      });

      if (created) {
        console.log(`Paciente "${paciente.Nome} ${paciente.Sobrenome}" (Email: ${paciente.Email}) inserido com sucesso.`);
      } else {
        console.log(`Paciente com Email "${paciente.Email}" já existe.`);
      }
    }
    console.log("Seeding de Pacientes concluído.");
  } catch (error) {
    console.error("Erro ao inserir Pacientes iniciais:", error);
  }
}

module.exports = seedPacientes;
