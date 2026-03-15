import React, { useEffect, useState } from 'react';
import '../../styles/layout/BodySobreNos.css';

const IconeInovacao = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="14" r="7" stroke="#3b6bc8" strokeWidth="2"/>
    <path d="M13 21v2a3 3 0 006 0v-2" stroke="#3b6bc8" strokeWidth="2"/>
    <path d="M16 7V5M9.5 9.5L8 8M22.5 9.5L24 8" stroke="#f4a623" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconeSeguranca = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 3L5 8v7c0 5.5 4.7 10.7 11 12 6.3-1.3 11-6.5 11-12V8L16 3z" stroke="#3b6bc8" strokeWidth="2"/>
    <path d="M11 16l3 3 7-7" stroke="#f4a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconeEficiencia = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M17 4L8 18h8l-1 10 9-14h-8l1-10z" stroke="#3b6bc8" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);
const IconeHumanizacao = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="12" cy="9" r="3.5" stroke="#3b6bc8" strokeWidth="2"/>
    <circle cx="22" cy="9" r="3.5" stroke="#3b6bc8" strokeWidth="2"/>
    <path d="M5 26c0-4 3.1-7 7-7h8c3.9 0 7 3 7 7" stroke="#f4a623" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const VALORES = [
  { Icon: IconeInovacao,    titulo: 'Inovação',      desc: 'Buscamos constantemente novas tecnologias para melhorar a qualidade do cuidado médico.' },
  { Icon: IconeSeguranca,   titulo: 'Segurança',     desc: 'A proteção dos dados de pacientes e profissionais é tratada como prioridade absoluta.' },
  { Icon: IconeEficiencia,  titulo: 'Eficiência',    desc: 'Reduzimos a burocracia para que o médico possa focar no que mais importa: o paciente.' },
  { Icon: IconeHumanizacao, titulo: 'Humanização',   desc: 'Tecnologia a serviço das pessoas. Nossa ferramenta existe para humanizar, não substituir.' },
];

const BodySobreNos: React.FC = () => {
  const [mostrarTopo, setMostrarTopo] = useState(false);

  useEffect(() => {
    const onScroll = () => setMostrarTopo(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section className="sobre-hero reveal">
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

      {/* ── MISSÃO E VISÃO ── */}
      <section className="sobre-cards">
        <div className="sobre-card reveal">
          <div className="sobre-card__icon-wrap">
            <img src="/img/ícone Missão.png" alt="Missão" />
          </div>
          <h3 className="sobre-card__title">NOSSA MISSÃO</h3>
          <p>Garantir que cada profissional de saúde tenha acesso a prontuários claros, padronizados e adaptados, promovendo segurança e eficiência no atendimento.</p>
        </div>
        <div className="sobre-card reveal">
          <div className="sobre-card__icon-wrap">
            <img src="/img/ícone Visão.png" alt="Visão" />
          </div>
          <h3 className="sobre-card__title">NOSSA VISÃO</h3>
          <p>Ser referência em inovação no uso de Inteligência Artificial para documentação médica, transformando a forma como profissionais acessam e compreendem os prontuários.</p>
        </div>
      </section>

      {/* ── NOSSOS VALORES ── */}
      <section className="sobre-valores">
        <h2 className="sobre-valores__title reveal">
          NOSSOS VALORES
          <span className="sobre-valores__plus">
            <span style={{ color: '#e05c35' }}>+</span>
            <span style={{ color: '#f4a623' }}>+</span>
          </span>
        </h2>
        <div className="sobre-valores__grid">
          {VALORES.map(({ Icon, titulo, desc }) => (
            <div key={titulo} className="sobre-valor reveal">
              <div className="sobre-valor__icon"><Icon /></div>
              <h3 className="sobre-valor__titulo">{titulo}</h3>
              <p className="sobre-valor__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NÚMEROS ── */}
      <section className="sobre-numeros reveal">
        <div className="sobre-num">
          <span className="sobre-num__val">+50</span>
          <span className="sobre-num__label">Médicos cadastrados na plataforma</span>
        </div>
        <div className="sobre-num__divider" />
        <div className="sobre-num">
          <span className="sobre-num__val">100%</span>
          <span className="sobre-num__label">Dados criptografados e protegidos</span>
        </div>
        <div className="sobre-num__divider" />
        <div className="sobre-num">
          <span className="sobre-num__val">24/7</span>
          <span className="sobre-num__label">Plataforma disponível a qualquer hora</span>
        </div>
        <div className="sobre-num__divider" />
        <div className="sobre-num">
          <span className="sobre-num__val">IA</span>
          <span className="sobre-num__label">Análise inteligente de prontuários</span>
        </div>
      </section>

      {mostrarTopo && (
        <button className="sobre__top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#f4a623"/>
            <path d="M12 16V8M8 12l4-4 4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Volte ao topo</span>
        </button>
      )}
    </>
  );
};
export default BodySobreNos;
