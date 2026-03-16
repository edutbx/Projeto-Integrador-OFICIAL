import React, { useEffect, useState } from 'react';
import { getGestorToken } from '../../services/authService';
import '../../styles/layout/BodyGestor.css';

const path = window.location.pathname;

const BodyGestor: React.FC = () => {
  const [medicosAtivos, setMedicosAtivos] = useState<number | null>(null);

  useEffect(() => {
    const token = getGestorToken();
    if (!token) return;

    fetch('/api/auth/admin/medicos', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setMedicosAtivos(d.totalMedicosAtivos ?? 0))
      .catch(() => setMedicosAtivos(0));
  }, []);

  return (
    <main className="gestor-main">
      <aside className="gestor-sidebar">
        <nav className="gestor-nav">
          <a
            href="/gestor"
            className={`gestor-nav__item ${path === '/gestor' ? 'gestor-nav__item--active' : ''}`}
          >
            Dashboard
          </a>
          <a
            href="/gestor/medicos"
            className={`gestor-nav__item ${path === '/gestor/medicos' ? 'gestor-nav__item--active' : ''}`}
          >
            Médicos
          </a>
        </nav>
      </aside>

      <section className="gestor-content">
        <h1>Painel do Gestor</h1>
        <div className="gestor-cards">
          <div className="gestor-card">
            <p className="gestor-card__num">
              {medicosAtivos === null ? '...' : medicosAtivos}
            </p>
            <p className="gestor-card__label">Médicos Ativos</p>
          </div>
          <div className="gestor-card">
            <p className="gestor-card__num">—</p>
            <p className="gestor-card__label">Consultas Hoje</p>
          </div>
          <div className="gestor-card">
            <p className="gestor-card__num">—</p>
            <p className="gestor-card__label">Prontuários</p>
          </div>
          <div className="gestor-card">
            <p className="gestor-card__num">—</p>
            <p className="gestor-card__label">Exames Pendentes</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BodyGestor;
