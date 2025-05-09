const { Medico, Login, Endereco, Gestor } = require("../models");

const medicosIniciais = [
  // Assumindo que o Login com CPF '333.444.555-66' (Tipo: medico) terá idLogin = 3
  // Assumindo que o primeiro Endereco inserido terá idEndereco = 1
  // Assumindo que o primeiro Gestor inserido terá idGestor = 1 (se GestorAprovador_idGestor for obrigatório)
  {
    Nome: "Drauzio",
    Sobrenome: "Varella",
    CPF: "123.456.789-10",
    RG: "MG1234567",
    CRM: "SP12345",
    DataNasc: "1943-05-01",
    Sexo: "M",
    Especializacao: "Oncologia",
    Login_idLogin_CPF: "333.444.555-66", // CPF do Login para buscar o ID
    Endereco_idEndereco_CEP_Numero: { CEP: "01001-000", Numero: 123 }, // CEP e Numero para buscar Endereco ID
    GestorAprovador_idGestor_CPF: "777.888.999-00" // CPF do Gestor para buscar o ID (opcional, se GestorAprovador_idGestor for nullable)
  },
  {
    Nome: "Roberta",
    Sobrenome: "Fernandes",
    CPF: "987.654.321-00",
    RG: "RJ9876543",
    CRM: "RJ54321",
    DataNasc: "1980-07-22",
    Sexo: "F",
    Especializacao: "Cardiologia",
    Login_idLogin_CPF: "333.444.555-66", // Pode ser outro login tipo medico
    Endereco_idEndereco_CEP_Numero: { CEP: "20040-030", Numero: 456 },
    GestorAprovador_idGestor_CPF: null // Exemplo sem gestor aprovador, se permitido
  }
];

async function seedMedicos() {
  try {
    for (const medicoData of medicosIniciais) {
      const loginInstance = await Login.findOne({ where: { CPF: medicoData.Login_idLogin_CPF } });
      const enderecoInstance = await Endereco.findOne({ 
        where: { 
          CEP: medicoData.Endereco_idEndereco_CEP_Numero.CEP, 
          Numero: medicoData.Endereco_idEndereco_CEP_Numero.Numero 
        }
      });

      let gestorInstance = null;
      if (medicoData.GestorAprovador_idGestor_CPF) {
        gestorInstance = await Gestor.findOne({ where: { CPF: medicoData.GestorAprovador_idGestor_CPF } });
      }

      if (!loginInstance) {
        console.warn(`Login com CPF ${medicoData.Login_idLogin_CPF} não encontrado para o médico ${medicoData.Nome}. Pulando.`);
        continue;
      }
      if (!enderecoInstance) {
        console.warn(`Endereço com CEP ${medicoData.Endereco_idEndereco_CEP_Numero.CEP} e Número ${medicoData.Endereco_idEndereco_CEP_Numero.Numero} não encontrado para o médico ${medicoData.Nome}. Pulando.`);
        continue;
      }
      if (medicoData.GestorAprovador_idGestor_CPF && !gestorInstance) {
        console.warn(`Gestor com CPF ${medicoData.GestorAprovador_idGestor_CPF} não encontrado para o médico ${medicoData.Nome}. Pulando.`);
        // Se o gestor for obrigatório, descomente a linha abaixo
        // continue;
      }

      const [medico, created] = await Medico.findOrCreate({
        where: { CPF: medicoData.CPF },
        defaults: {
          Nome: medicoData.Nome,
          Sobrenome: medicoData.Sobrenome,
          CPF: medicoData.CPF,
          RG: medicoData.RG,
          CRM: medicoData.CRM,
          DataNasc: medicoData.DataNasc,
          Sexo: medicoData.Sexo,
          Especializacao: medicoData.Especializacao,
          Login_idLogin: loginInstance.idLogin,
          Endereco_idEndereco: enderecoInstance.idEndereco,
          GestorAprovador_idGestor: gestorInstance ? gestorInstance.idGestor : null
        }
      });

      if (created) {
        console.log(`Médico "${medico.Nome} ${medico.Sobrenome}" (CRM: ${medico.CRM}) inserido com sucesso.`);
      } else {
        console.log(`Médico com CPF "${medico.CPF}" já existe.`);
      }
    }
    console.log("Seeding de Médicos concluído.");
  } catch (error) {
    console.error("Erro ao inserir Médicos iniciais:", error);
  }
}

module.exports = seedMedicos;
