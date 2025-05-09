const { Endereco } = require("../models");

const enderecosIniciais = [
  {
    Logadouro: "Rua das Flores",
    CEP: "01001-000",
    Cidade: "São Paulo",
    Estado: "SP",
    Numero: 123,
    Complemento: "Apto 10"
  },
  {
    Logadouro: "Avenida Principal",
    CEP: "20040-030",
    Cidade: "Rio de Janeiro",
    Estado: "RJ",
    Numero: 456,
    Complemento: "Bloco B, Sala 1"
  },
  {
    Logadouro: "Praça da Sé",
    CEP: "01001-001",
    Cidade: "São Paulo",
    Estado: "SP",
    Numero: 789,
    Complemento: null
  },
  {
    Logadouro: "Rua dos Navegantes",
    CEP: "51021-010",
    Cidade: "Recife",
    Estado: "PE",
    Numero: 1000,
    Complemento: "Casa"
  }
];

async function seedEnderecos() {
  try {
    for (const endData of enderecosIniciais) {
      const [endereco, created] = await Endereco.findOrCreate({
        where: { Logadouro: endData.Logadouro, CEP: endData.CEP, Numero: endData.Numero }, // Evitar duplicados
        defaults: endData
      });
      if (created) {
        console.log(`Endereço "${endereco.Logadouro}, ${endereco.Numero}" inserido com sucesso.`);
      } else {
        console.log(`Endereço "${endereco.Logadouro}, ${endereco.Numero}" já existe.`);
      }
    }
    console.log("Seeding de Endereços concluído.");
  } catch (error) {
    console.error("Erro ao inserir Endereços iniciais:", error);
  }
}

module.exports = seedEnderecos;
