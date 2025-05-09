const { Gestor, Login } = require("../models");

const gestoresIniciais = [
  // Assumindo que o Login com CPF '444.555.666-77' (Tipo: gestor) terá idLogin = 4 (após os 3 primeiros logins)
  // É crucial que os IDs de Login correspondam aos que foram criados pelo loginSeeder.js
  // Para robustez, seria melhor buscar o Login pelo CPF no seeder.
  {
    Nome: "Carlos",
    CPF: "777.888.999-00", // CPF do Gestor, diferente do CPF do Login associado
    Cargo: "Gerente Administrativo",
    Login_idLogin_CPF: "444.555.666-77" // Usar CPF para buscar o Login ID
  },
  {
    Nome: "Ana",
    CPF: "888.999.000-11",
    Cargo: "Supervisora de Atendimento",
    Login_idLogin_CPF: "444.555.666-77" // Pode ser o mesmo login para mais de um gestor, se a lógica permitir, ou criar outro login tipo gestor
  }
];

async function seedGestores() {
  try {
    for (const gestorData of gestoresIniciais) {
      const loginInstance = await Login.findOne({ where: { CPF: gestorData.Login_idLogin_CPF } });
      if (!loginInstance) {
        console.warn(`Login com CPF ${gestorData.Login_idLogin_CPF} não encontrado para o gestor ${gestorData.Nome}. Pulando.`);
        continue;
      }

      const [gestor, created] = await Gestor.findOrCreate({
        where: { CPF: gestorData.CPF },
        defaults: {
          Nome: gestorData.Nome,
          CPF: gestorData.CPF,
          Cargo: gestorData.Cargo,
          Login_idLogin: loginInstance.idLogin
        }
      });
      if (created) {
        console.log(`Gestor "${gestor.Nome}" (CPF: ${gestor.CPF}) inserido com sucesso.`);
      } else {
        console.log(`Gestor com CPF "${gestor.CPF}" já existe.`);
      }
    }
    console.log("Seeding de Gestores concluído.");
  } catch (error) {
    console.error("Erro ao inserir Gestores iniciais:", error);
  }
}

module.exports = seedGestores;
