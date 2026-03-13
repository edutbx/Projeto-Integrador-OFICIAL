import React, { useEffect } from 'react';
import './BodyServicos.css';

const IconeProntuario = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="4" width="24" height="32" rx="3" stroke="#3b6bc8" strokeWidth="2.2"/>
    <path d="M14 14h12M14 20h12M14 26h8" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="10" r="3" stroke="#3b6bc8" strokeWidth="2"/>
  </svg>
);

const IconeHistorico = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="14" stroke="#3b6bc8" strokeWidth="2.2"/>
    <path d="M20 12v9l6 4" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconeExames = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="6" y="6" width="28" height="28" rx="4" stroke="#3b6bc8" strokeWidth="2.2"/>
    <path d="M13 20h5l3-6 4 12 3-6h5" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconeApoio = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M20 34s-14-8.5-14-18a8 8 0 0116 0 8 8 0 0116 0c0 9.5-14 18-18 18z" stroke="#3b6bc8" strokeWidth="2.2"/>
    <polyline points="12,20 16,16 20,22 24,14 28,20 32,20" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconeIA = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="8" width="24" height="24" rx="4" stroke="#3b6bc8" strokeWidth="2.2"/>
    <path d="M14 14h12M14 20h12M14 26h8" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="30" cy="10" r="5" fill="#f4a623"/>
    <path d="M28 10h4M30 8v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconeSeguranca = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M20 4l14 6v10c0 8-6 14-14 16C12 34 6 28 6 20V10l14-6z" stroke="#3b6bc8" strokeWidth="2.2"/>
    <polyline points="14,20 18,24 26,16" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SERVICOS = [
  {
    Icon: IconeProntuario,
    titulo: 'Centralização de Prontuários',
    desc: 'Todos os registros médicos reunidos em uma única plataforma segura, acessível de qualquer lugar para os profissionais autorizados.',
  },
  {
    Icon: IconeHistorico,
    titulo: 'Histórico Clínico',
    desc: 'Acesse o histórico completo de cada paciente de forma rápida, organizada e cronológica, facilitando o acompanhamento do tratamento.',
  },
  {
    Icon: IconeExames,
    titulo: 'Exames e Documentos',
    desc: 'Armazene, visualize e compartilhe resultados de exames, laudos e documentos clínicos de maneira estruturada e segura.',
  },
  {
    Icon: IconeApoio,
    titulo: 'Apoio à Decisão',
    desc: 'Ferramentas inteligentes que auxiliam o profissional de saúde a tomar decisões mais assertivas com base no histórico do paciente.',
  },
  {
    Icon: IconeIA,
    titulo: 'Interpretação Inteligente',
    desc: 'Inteligência Artificial analisa prontuários e gera versões adaptadas à especialidade de cada médico, reduzindo erros e otimizando o atendimento.',
  },
  {
    Icon: IconeSeguranca,
    titulo: 'Segurança e Acesso Controlado',
    desc: 'Controle de acesso rigoroso com autenticação por perfil, garantindo que apenas profissionais autorizados acessem os dados dos pacientes.',
  },
];

const BodyServicos: React.FC = () => {
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
      <section className="serv__hero reveal">
        <div className="serv__hero-text">
          <h1 className="serv__hero-title">NOSSAS SOLUÇÕES</h1>
          <p>O Saúde++ oferece uma suíte completa de ferramentas para modernizar a gestão de prontuários médicos.</p>
          <p>Com tecnologia de ponta e inteligência artificial, transformamos a documentação clínica em um processo mais <strong>seguro, eficiente e adaptado</strong> a cada especialidade.</p>
        </div>
      </section>

      {/* ── CARDS DE SERVIÇOS ── */}
      <section className="serv__cards-section">
        <h2 className="serv__section-title reveal">
          SERVIÇOS
          <span className="serv__plus">
            <span style={{ color: '#e05c35' }}>+</span>
            <span style={{ color: '#f4a623' }}>+</span>
          </span>
        </h2>
        <div className="serv__cards">
          {SERVICOS.map(({ Icon, titulo, desc }) => (
            <div key={titulo} className="serv__card reveal">
              <div className="serv__card-icon"><Icon /></div>
              <h3 className="serv__card-title">{titulo}</h3>
              <p className="serv__card-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="serv__cta reveal">
        <h2>Pronto para modernizar sua clínica?</h2>
        <p>Entre em contato com nosso time ou fale com o gestor responsável para iniciar o uso da plataforma.</p>
        <a href="/contato" className="serv__cta-btn">Fale Conosco</a>
      </section>
    </>
  );
};

export default BodyServicos;
