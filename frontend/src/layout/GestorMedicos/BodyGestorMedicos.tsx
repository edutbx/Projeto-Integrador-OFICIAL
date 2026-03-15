import React, { useEffect, useState } from 'react';
import { getGestorToken } from '../../services/authService';
import { MedicoResumo } from '../../types';
import '../../styles/layout/BodyGestor.css'; // classes compartilhadas: gestor-main, gestor-sidebar, gestor-nav
import '../../styles/layout/BodyGestorMedicos.css';

const path = window.location.pathname;

const BodyGestorMedicos: React.FC = () => {
  const [medicos, setMedicos] = useState<MedicoResumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getGestorToken();
    if (!token) return;

    fetch('/api/auth/admin/medicos', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        setMedicos(d.medicos ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
        <div className="gmed__header">
          <h1>Médicos Cadastrados</h1>
          <a href="/cadastro?source=gestor" className="gmed__btn-novo">
            + Cadastrar Médico
          </a>
        </div>

        {loading ? (
          <p className="gmed__loading">Carregando médicos...</p>
        ) : medicos.length === 0 ? (
          <div className="gmed__empty">
            <p>Nenhum médico cadastrado ainda.</p>
            <a href="/cadastro?source=gestor" className="gmed__btn-novo">Cadastrar primeiro médico</a>
          </div>
        ) : (
          <div className="gmed__table-wrap">
            <table className="gmed__table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CRM</th>
                  <th>Especialidade</th>
                  <th>E-mail</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {medicos.map(m => (
                  <tr key={m.id}>
                    <td className="gmed__td-nome">{m.nome} {m.sobrenome}</td>
                    <td>{m.crm || '—'}</td>
                    <td>{m.especializacao || '—'}</td>
                    <td>{m.email}</td>
                    <td>
                      <span className="gmed__badge">Ativo</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default BodyGestorMedicos;
