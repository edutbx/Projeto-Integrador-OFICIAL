import React, { useEffect, useRef, useState } from 'react';
import './BodyHome.css';

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
  { Icon: IconeCoracao, titulo: 'Adaptação Personalizada', desc: 'Cada especialidade médica recebe a versão do prontuário mais relevante para sua atuação.' },
  { Icon: IconeComunicacao, titulo: 'Comunicação Segura', desc: 'Histórico de alterações acessível e confiável, promovendo integração entre diferentes profissionais.' },
];

const BodyHome: React.FC = () => {
  const [mostrarTopo, setMostrarTopo] = useState(false);
  const [contato, setContato] = useState({ nome: '', email: '', mensagem: '' });

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

  const handleContato = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada! Entraremos em contato em breve.');
    setContato({ nome: '', email: '', mensagem: '' });
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="home__hero reveal">
        <div className="home__hero-img-wrap">
          <img src="/img/estetoscopio.png" alt="Estetoscópio" className="home__hero-img" />
        </div>
        <div className="home__hero-text">
          <h1 className="home__hero-title">O FUTURO DA SAÚDE É AGORA</h1>
          <p>Mais clareza, padronização e segurança na comunicação médica.</p>
          <p>Com ajuda de inteligência artificial, os prontuários são adaptados à especialidade de cada profissional, <strong>reduzindo erros e otimizando o atendimento.</strong></p>
          <a href="/cadastro" className="home__hero-btn">Cadastre-se</a>
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

      {/* ── ENTRE EM CONTATO ── */}
      <section className="home__contato">
        <h2 className="home__contato-title reveal">
          ENTRE EM CONTATO
          <span className="home__servicos-plus">
            <span style={{ color: '#e05c35' }}>+</span>
            <span style={{ color: '#f4a623' }}>+</span>
          </span>
        </h2>
        <div className="home__contato-inner">
          <form className="home__contato-form reveal" onSubmit={handleContato}>
            <div className="home__field">
              <label>Nome:</label>
              <input value={contato.nome} onChange={e => setContato({...contato, nome: e.target.value})} placeholder="Seu nome" required />
            </div>
            <div className="home__field">
              <label>E-mail:</label>
              <input type="email" value={contato.email} onChange={e => setContato({...contato, email: e.target.value})} placeholder="seu@email.com" required />
            </div>
            <div className="home__field">
              <label>Mensagem:</label>
              <textarea rows={5} value={contato.mensagem} onChange={e => setContato({...contato, mensagem: e.target.value})} placeholder="Sua mensagem..." required />
            </div>
            <button type="submit" className="home__contato-btn">Enviar</button>
          </form>
          <div className="home__contato-imgs reveal">
            <div className="home__contato-circle home__contato-circle--1">
              <img src="/img/Imagem card 1 Nossos Serviços.png" alt="médico" />
            </div>
            <div className="home__contato-circle home__contato-circle--2">
              <img src="/img/estetoscopio.png" alt="saúde" />
            </div>
          </div>
        </div>
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
