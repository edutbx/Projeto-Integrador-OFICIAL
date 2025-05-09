const { QuestionarioSaude } = require("../models");

const questionariosIniciais = [
  {
    PreCondicao: "S",
    Alergia: "N",
    Cirurgia: "S",
    Alcool: "N",
    Fuma: "N"
  },
  {
    PreCondicao: "N",
    Alergia: "S", // Ex: Alergia a Penicilina
    Cirurgia: "N",
    Alcool: "S",
    Fuma: "S"
  },
  {
    PreCondicao: "N",
    Alergia: "N",
    Cirurgia: "N",
    Alcool: "N",
    Fuma: "N"
  },
  {
    PreCondicao: "S", // Ex: Hipertensão
    Alergia: "S", // Ex: Alergia a Camarão
    Cirurgia: "S", // Ex: Apendicectomia
    Alcool: "S", // Consumo social
    Fuma: "N"
  }
];

async function seedQuestionariosSaude() {
  try {
    // Como não há um campo único óbvio para `where` no findOrCreate, 
    // e os dados são simples (S/N), vamos apenas inserir alguns e contar com o auto-incremento do ID.
    // Para evitar duplicados exatos, poderíamos verificar todos os campos, mas para dados de seed simples, 
    // a inserção direta ou a contagem de registos existentes pode ser suficiente.
    // Por simplicidade, vamos inserir se a tabela estiver vazia ou com poucos registos.

    const count = await QuestionarioSaude.count();
    if (count < questionariosIniciais.length) { // Insere apenas se houver menos registos do que os que queremos inserir
      for (const qsData of questionariosIniciais) {
        // Tentativa de encontrar um registo exatamente igual para evitar duplicados idênticos.
        const [qs, created] = await QuestionarioSaude.findOrCreate({
          where: {
            PreCondicao: qsData.PreCondicao,
            Alergia: qsData.Alergia,
            Cirurgia: qsData.Cirurgia,
            Alcool: qsData.Alcool,
            Fuma: qsData.Fuma
          },
          defaults: qsData
        });
        if (created) {
          console.log(`Questionário de Saúde (ID: ${qs.idQuestionarioSaude}) inserido com sucesso.`);
        } else {
          // console.log(`Questionário de Saúde com dados idênticos já existe (ID: ${qs.idQuestionarioSaude}).`);
        }
      }
    } else {
      console.log("Questionários de Saúde já parecem estar populados.");
    }
    console.log("Seeding de Questionários de Saúde concluído.");
  } catch (error) {
    console.error("Erro ao inserir Questionários de Saúde iniciais:", error);
  }
}

module.exports = seedQuestionariosSaude;
