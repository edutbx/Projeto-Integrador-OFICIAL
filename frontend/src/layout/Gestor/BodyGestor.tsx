import React from 'react';
import './BodyGestor.css';

const BodyGestor: React.FC = () => (
  <main className="gestor-main">
    <aside className="gestor-sidebar">
      <nav className="gestor-nav">
        <a href="/gestor" className="gestor-nav__item gestor-nav__item--active">Dashboard</a>
        <a href="/" className="gestor-nav__item">Médicos</a>
        <a href="/" className="gestor-nav__item">Pacientes</a>
        <a href="/" className="gestor-nav__item">Relatórios</a>
        <a href="/" className="gestor-nav__item">Configurações</a>
      </nav>
    </aside>
    <section className="gestor-content">
      <h1>Painel do Gestor</h1>
      <div className="gestor-cards">
        {['Médicos Ativos', 'Consultas Hoje', 'Prontuários', 'Exames Pendentes'].map((item, i) => (
          <div key={item} className="gestor-card">
            <p className="gestor-card__num">{[12, 34, 245, 8][i]}</p>
            <p className="gestor-card__label">{item}</p>
          </div>
        ))}
      </div>
    </section>
  </main>
);
export default BodyGestor;
