const { TermoDeUso } = require("../models");

const termosDeUsoIniciais = [
  {
    NumeroVersao: 1.0,
    TituloTermo: "Termos de Uso Iniciais da Plataforma",
    Texto: "Este é o texto completo dos termos de uso iniciais da plataforma. Ao utilizar nossos serviços, você concorda com todas as cláusulas aqui apresentadas...",
    DataPublicacao: "2024-01-15",
    DescricaoAlteracao: "Versão inicial dos termos de uso.",
    TipoTermo: "Geral"
  },
  {
    NumeroVersao: 1.1,
    TituloTermo: "Política de Privacidade v1.1",
    Texto: "Esta é a nossa política de privacidade, detalhando como coletamos, usamos e protegemos seus dados pessoais...",
    DataPublicacao: "2024-03-01",
    DescricaoAlteracao: "Atualização da seção de coleta de dados e consentimento.",
    TipoTermo: "Privacidade"
  }
];

async function seedTermosDeUso() {
  try {
    for (const termoData of termosDeUsoIniciais) {
      const [termo, created] = await TermoDeUso.findOrCreate({
        where: { TituloTermo: termoData.TituloTermo, NumeroVersao: termoData.NumeroVersao }, // Evitar duplicados pelo título e versão
        defaults: termoData
      });
      if (created) {
        console.log(`Termo de Uso "${termo.TituloTermo} v${termo.NumeroVersao}" inserido com sucesso.`);
      } else {
        console.log(`Termo de Uso "${termo.TituloTermo} v${termo.NumeroVersao}" já existe.`);
      }
    }
    console.log("Seeding de Termos de Uso concluído.");
  } catch (error) {
    console.error("Erro ao inserir Termos de Uso iniciais:", error);
  }
}

module.exports = seedTermosDeUso;
