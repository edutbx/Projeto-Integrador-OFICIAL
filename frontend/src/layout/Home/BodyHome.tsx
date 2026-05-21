import React, { useEffect, useState } from 'react';
import '../../styles/layout/BodyHome.css';

const IconeProntuario = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="4" width="24" height="32" rx="3" stroke="#3b6bc8" strokeWidth="2.2"/>
    <path d="M14 14h12M14 20h12M14 26h8" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="10" r="3" stroke="#3b6bc8" strokeWidth="2"/>
    <line x1="20" y1="7" x2="20" y2="13" stroke="#3b6bc8" strokeWidth="2"/>
  </svg>
);
const IconeCoracao = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M20 34s-14-8.5-14-18a8 8 0 0116 0 8 8 0 0116 0c0 9.5-14 18-18 18z" stroke="#3b6bc8" strokeWidth="2.2"/>
    <polyline points="10,20 14,16 18,22 22,14 26,20 30,20" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconeComunicacao = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="6" y="8" width="28" height="20" rx="3" stroke="#3b6bc8" strokeWidth="2.2"/>
    <path d="M14 28l6 6 6-6" stroke="#3b6bc8" strokeWidth="2"/>
    <path d="M13 18h14M13 22h10" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SERVICOS = [
  { Icon: IconeProntuario, titulo: 'Padronização Inteligente', desc: 'A IA padroniza os prontuários, garantindo clareza e redução de erros nos registros médicos.' },
  { Icon: IconeCoracao,    titulo: 'Adaptação Personalizada',  desc: 'Cada especialidade médica recebe a versão do prontuário mais relevante para sua atuação.' },
  { Icon: IconeComunicacao,titulo: 'Comunicação Segura',       desc: 'Histórico de alterações acessível e confiável, promovendo integração entre diferentes profissionais.' },
];

const PASSOS = [
  { num: '01', titulo: 'Cadastro Médico',      desc: 'O gestor cadastra o profissional na plataforma com suas especialidades e dados de acesso.' },
  { num: '02', titulo: 'Envio do Prontuário',  desc: 'O médico envia o prontuário em PDF para análise pela inteligência artificial.' },
  { num: '03', titulo: 'Resultado Adaptado',   desc: 'A IA processa e retorna uma versão padronizada, adaptada à especialidade do profissional.' },
];

const BodyHome: React.FC = () => {
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
      <section className="home__hero reveal">
        <div className="home__hero-img-wrap">
          <img src="img\foto-nova-home.png" alt="Estetoscópio" className="home__hero-img" />
        </div>
        <div className="home__hero-text">
          <h1 className="home__hero-title">Tecnologia que transforma cuidado em vida.</h1>
          <p>Mais clareza, padronização e segurança na comunicação médica.</p>
          <p>Com ajuda de inteligência artificial, os prontuários são adaptados à especialidade de cada profissional, <strong>reduzindo erros e otimizando o atendimento.</strong></p>
          <a href="/entrar" className="home__hero-btn">Acessar Plataforma</a>
        </div>
      </section>

      {/* ── NOSSOS SERVIÇOS ── */}
      <section className="home__servicos">
        <h2 className="home__servicos-title reveal">
          NOSSOS SERVIÇOS
          <span className="home__servicos-plus">
            <span style={{ color: '#e05c35' }}>+</span>
            <span style={{ color: '#f4a623' }}>+</span>
          </span>
        </h2>
        <div className="home__cards">
          {SERVICOS.map(({ Icon, titulo, desc }) => (
            <div key={titulo} className="home__card reveal">
              <div className="home__card-icon"><Icon /></div>
              <h3 className="home__card-title">{titulo}</h3>
              <p className="home__card-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="home__como">
        <h2 className="home__como-title reveal">
          COMO FUNCIONA
          <span className="home__servicos-plus">
            <span style={{ color: '#e05c35' }}>+</span>
            <span style={{ color: '#f4a623' }}>+</span>
          </span>
        </h2>
        <div className="home__steps">
          {PASSOS.map(({ num, titulo, desc }) => (
            <div key={num} className="home__step reveal">
              <span className="home__step-num">{num}</span>
              <h3 className="home__step-titulo">{titulo}</h3>
              <p className="home__step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home__cta reveal">
        <h2 className="home__cta-title">Pronto para transformar sua gestão médica?</h2>
        <p className="home__cta-sub">Fale com nosso time e descubra como o Saúde++ pode ajudar sua instituição.</p>
        <a href="/contato" className="home__cta-btn">Fale Conosco</a>
      </section>

      {mostrarTopo && (
        <button className="home__top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
export default BodyHome;
