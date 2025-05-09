const { Login } = require("../models");
const bcrypt = require("bcryptjs"); // Para hashear senhas

// Função auxiliar para hashear senhas
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

const loginsIniciais = [
  {
    CPF: "111.222.333-44",
    SenhaPlain: "paciente123", // Senha em texto plano para o seeder
    TipoUsuario: "paciente"
  },
  {
    CPF: "222.333.444-55",
    SenhaPlain: "paciente456",
    TipoUsuario: "paciente"
  },
  {
    CPF: "333.444.555-66",
    SenhaPlain: "medico123",
    TipoUsuario: "medico"
  },
  {
    CPF: "444.555.666-77",
    SenhaPlain: "gestor123",
    TipoUsuario: "gestor"
  }
];

async function seedLogins() {
  try {
    for (const loginData of loginsIniciais) {
      const hashedSenha = await hashPassword(loginData.SenhaPlain);
      const [login, created] = await Login.findOrCreate({
        where: { CPF: loginData.CPF },
        defaults: {
          CPF: loginData.CPF,
          Senha: hashedSenha,
          TipoUsuario: loginData.TipoUsuario
        }
      });
      if (created) {
        console.log(`Login para CPF "${login.CPF}" (Tipo: ${login.TipoUsuario}) inserido com sucesso.`);
      } else {
        console.log(`Login para CPF "${login.CPF}" já existe.`);
      }
    }
    console.log("Seeding de Logins concluído.");
  } catch (error) {
    console.error("Erro ao inserir Logins iniciais:", error);
  }
}

module.exports = seedLogins;
