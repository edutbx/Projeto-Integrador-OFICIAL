import React, { useEffect, useState } from 'react';
import { getGestorToken } from '../../services/authService';
import { MedicoResumo } from '../../types';
import '../../styles/layout/BodyGestor.css'; // classes compartilhadas: gestor-main, gestor-sidebar, gestor-nav
import '../../styles/layout/BodyGestorMedicos.css';

const path = window.location.pathname;

interface ModalDeleteState {
  open: boolean;
  medico: MedicoResumo | null;
  emailGestor: string;
  loading: boolean;
  erro: string | null;
}

const MODAL_INICIAL: ModalDeleteState = {
  open: false,
  medico: null,
  emailGestor: '',
  loading: false,
  erro: null,
};

const BodyGestorMedicos: React.FC = () => {
  const [medicos, setMedicos] = useState<MedicoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [desativados, setDesativados] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalDeleteState>(MODAL_INICIAL);
  const [busca, setBusca] = useState('');

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

  function abrirModalDelete(medico: MedicoResumo) {
    setModal({ ...MODAL_INICIAL, open: true, medico });
  }

  function fecharModal() {
    setModal(MODAL_INICIAL);
  }

  async function confirmarDelete() {
    if (!modal.medico) return;

    if (!modal.emailGestor.trim()) {
      setModal(m => ({ ...m, erro: 'Informe sua identificação para continuar.' }));
      return;
    }

    const emailSalvo = localStorage.getItem('gestor_email') ?? '';
    if (modal.emailGestor.trim().toLowerCase() !== emailSalvo.toLowerCase()) {
      setModal(m => ({ ...m, erro: 'Identificação incorreta. Informe o e-mail do gestor logado.' }));
      return;
    }

    setModal(m => ({ ...m, loading: true, erro: null }));
    const token = getGestorToken();

    try {
      const res = await fetch('/api/auth/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: modal.medico.id }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setModal(m => ({ ...m, loading: false, erro: d.error || 'Erro ao deletar médico.' }));
        return;
      }

      setMedicos(prev => prev.filter(m => m.id !== modal.medico!.id));
      fecharModal();
    } catch {
      setModal(m => ({ ...m, loading: false, erro: 'Erro de conexão. Tente novamente.' }));
    }
  }

  function toggleDesativar(id: string) {
    setDesativados(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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
          <a
            href="/gestor/pacientes"
            className={`gestor-nav__item ${path === '/gestor/pacientes' ? 'gestor-nav__item--active' : ''}`}
          >
            Pacientes
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
          <>
            <div className="gmed__search">
              <input
                className="gmed__search-input"
                type="text"
                placeholder="Buscar por nome, CRM ou e-mail..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
              <button
                className="gmed__search-btn"
                type="button"
                onClick={() => setBusca(busca.trim())}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16a6.47 6.47 0 004.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 115 9.5 4.5 4.5 0 019.5 14z"/>
                </svg>
                Buscar
              </button>
            </div>

          {(() => {
            const termo = busca.trim().toLowerCase();
            const medicosFiltrados = termo
              ? medicos.filter(m =>
                  `${m.nome} ${m.sobrenome}`.toLowerCase().includes(termo) ||
                  (m.crm || '').toLowerCase().includes(termo) ||
                  (m.email || '').toLowerCase().includes(termo)
                )
              : medicos;

            if (medicosFiltrados.length === 0) {
              return (
                <div className="gmed__not-found">
                  <p>Médico não encontrado.</p>
                  <button className="gmed__not-found-clear" onClick={() => setBusca('')}>
                    Limpar busca
                  </button>
                </div>
              );
            }

            return (
          <div className="gmed__table-wrap">
            <table className="gmed__table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CRM</th>
                  <th>Especialidade</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {medicosFiltrados.map(m => {
                  const inativo = desativados.has(m.id);
                  return (
                    <tr key={m.id} className={inativo ? 'gmed__tr--inativo' : ''}>
                      <td className="gmed__td-nome">{m.nome} {m.sobrenome}</td>
                      <td>{m.crm || '—'}</td>
                      <td>{m.especializacao || '—'}</td>
                      <td>{m.email}</td>
                      <td>
                        <span className={`gmed__badge${inativo ? ' gmed__badge--inativo' : ''}`}>
                          {inativo ? 'Inativo' : 'Ativo'}
                        </span>
                      </td>
                      <td>
                        <div className="gmed__actions">
                          <button
                            className={`gmed__btn-action${inativo ? ' gmed__btn-action--reativar' : ' gmed__btn-action--pause'}`}
                            title={inativo ? 'Reativar médico' : 'Desativar médico'}
                            onClick={() => toggleDesativar(m.id)}
                          >
                            {inativo ? (
                              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                              </svg>
                            )}
                          </button>
                          <button
                            className="gmed__btn-action gmed__btn-action--delete"
                            title="Deletar médico"
                            onClick={() => abrirModalDelete(m)}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                              <path d="M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zm0 5h2v9H9V8zm4 0h2v9h-2V8z"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
            );
          })()}
          </>
        )}
      </section>

      {modal.open && modal.medico && (
        <div className="gmed__modal-overlay" onClick={fecharModal}>
          <div className="gmed__modal" onClick={e => e.stopPropagation()}>
            <h2 className="gmed__modal-title">Confirmar exclusão</h2>
            <p className="gmed__modal-desc">
              Você está prestes a excluir permanentemente o médico{' '}
              <strong>{modal.medico.nome} {modal.medico.sobrenome}</strong>
              {modal.medico.crm ? ` (CRM: ${modal.medico.crm})` : ''}.
              <br />Essa ação não pode ser desfeita.
            </p>

            <label className="gmed__modal-label" htmlFor="gmed-email-gestor">
              Informe seu e-mail para confirmar
            </label>
            <input
              id="gmed-email-gestor"
              className="gmed__modal-input"
              type="email"
              placeholder="seu@email.com"
              value={modal.emailGestor}
              onChange={e => setModal(m => ({ ...m, emailGestor: e.target.value, erro: null }))}
              autoFocus
            />

            {modal.erro && <p className="gmed__modal-erro">{modal.erro}</p>}

            <div className="gmed__modal-actions">
              <button
                className="gmed__modal-btn gmed__modal-btn--cancel"
                onClick={fecharModal}
                disabled={modal.loading}
              >
                Cancelar
              </button>
              <button
                className="gmed__modal-btn gmed__modal-btn--confirm"
                onClick={confirmarDelete}
                disabled={modal.loading}
              >
                {modal.loading ? 'Deletando...' : 'Confirmar exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BodyGestorMedicos;
