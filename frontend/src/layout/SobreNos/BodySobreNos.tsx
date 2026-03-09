import React from 'react';
import './BodySobreNos.css';

const BodySobreNos: React.FC = () => (
  <>
    <section className="sobre-hero">
      <div className="sobre-hero__text">
        <h1 className="sobre-hero__kicker">DEIXANDO A SAÚDE + DIGITAL</h1>
        <p>O Saúde++ nasceu da necessidade de melhorar a clareza, a padronização e a comunicação nos registros médicos.</p>
        <p>Nossa solução utiliza Inteligência Artificial para analisar prontuários clínicos e gerar versões adaptadas conforme a especialidade de cada profissional.</p>
        <p>Com isso, buscamos <strong>reduzir erros médicos, facilitar a troca de informações entre especialistas e tornar a documentação mais eficiente e segura.</strong></p>
      </div>
      <div className="sobre-hero__photo-wrap">
        <div className="sobre-hero__circle">
          <img src="/img/Imagem Sobre Banner Inicial.png" alt="Equipe médica" />
        </div>
      </div>
    </section>

    <section className="sobre-cards">
      <div className="sobre-card sobre-card--left">
        <div className="sobre-card__content">
          <h3 className="sobre-card__title">NOSSA MISSÃO</h3>
          <p>Garantir que cada profissional de saúde tenha acesso a prontuários claros, padronizados e adaptados, promovendo segurança e eficiência no atendimento.</p>
        </div>
        <div className="sobre-card__icon">
          <img src="/img/ícone Missão.png" alt="Missão" />
        </div>
      </div>
      <div className="sobre-card sobre-card--right">
        <div className="sobre-card__icon">
          <img src="/img/ícone Visão.png" alt="Visão" />
        </div>
        <div className="sobre-card__content sobre-card__content--right">
          <h3 className="sobre-card__title">NOSSA VISÃO</h3>
          <p>Ser referência em inovação no uso de Inteligência Artificial para documentação médica, transformando a forma como profissionais acessam e compreendem os prontuários.</p>
        </div>
      </div>
    </section>
  </>
);
export default BodySobreNos;
