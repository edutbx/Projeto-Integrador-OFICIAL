import React, { useState } from 'react';
import { logout, trocarSenha } from '../../services/authService';
import Logo from '../Logo/Logo';
import '../../styles/components/DoctorHeader.css';

interface DoctorHeaderProps { nome?: string; sobrenome?: string; crm?: string; especializacao?: string; }

interface ModalSenhaState {
  open: boolean;
  senhaAntiga: string;
  novaSenha: string;
  confirmacao: string;
  verSenhaAntiga: boolean;
  verNovaSenha: boolean;
  verConfirmacao: boolean;
  loading: boolean;
  erro: string | null;
  sucesso: boolean;
}

const MODAL_INICIAL: ModalSenhaState = {
  open: false,
  senhaAntiga: '', novaSenha: '', confirmacao: '',
  verSenhaAntiga: false, verNovaSenha: false, verConfirmacao: false,
  loading: false, erro: null, sucesso: false,
};

const DoctorIcon: React.FC = () => (
  <div className="doc-avatar">
    <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
      <circle cx="28" cy="28" r="28" fill="#FFF3D0" stroke="#F4A623" strokeWidth="2.5"/>
      <circle cx="28" cy="20" r="8" fill="#3b6bc8"/>
      <path d="M12 46c0-8.837 7.163-14 16-14s16 5.163 16 14" fill="#3b6bc8"/>
      <circle cx="36" cy="34" r="5" fill="none" stroke="#F4A623" strokeWidth="2"/>
      <path d="M36 39v4" stroke="#F4A623" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const DoctorHeader: React.FC<DoctorHeaderProps> = ({ nome = 'Médico', sobrenome = '', crm = 'Crm', especializacao = 'Especialidade' }) => {
  const [modal, setModal] = useState<ModalSenhaState>(MODAL_INICIAL);

  function abrirModal() {
    setModal({ ...MODAL_INICIAL, open: true });
  }

  function fecharModal() {
    if (modal.loading) return;
    setModal(MODAL_INICIAL);
  }

  async function enviar() {
    if (!modal.senhaAntiga) {
      setModal(m => ({ ...m, erro: 'Informe sua senha atual.' }));
      return;
    }
    if (modal.novaSenha.length < 6) {
      setModal(m => ({ ...m, erro: 'A nova senha deve ter pelo menos 6 caracteres.' }));
      return;
    }
    if (modal.novaSenha !== modal.confirmacao) {
      setModal(m => ({ ...m, erro: 'A confirmação não coincide com a nova senha.' }));
      return;
    }
    setModal(m => ({ ...m, loading: true, erro: null }));
    try {
      await trocarSenha(modal.senhaAntiga, modal.novaSenha);
      setModal(m => ({ ...m, loading: false, sucesso: true }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao alterar senha.';
      setModal(m => ({ ...m, loading: false, erro: msg }));
    }
  }

  return (
    <>
      <header className="doc-header">
        <Logo size="sm" href="/medico" />
        <div className="doc-header__right">
          <div className="doc-header__info">
            <p className="doc-header__name"><span className="doc-header__dr">Dr: </span>{nome} {sobrenome}</p>
            <p className="doc-header__crm"><strong>CRM:</strong> {crm}</p>
            <p className="doc-header__spec"><strong>Especialização:</strong> {especializacao}</p>
          </div>
          <DoctorIcon />
          <button
            className="doc-header__alterar-senha"
            onClick={abrirModal}
            title="Alterar senha"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path d="M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z"/>
            </svg>
            <span>Alterar Senha</span>
          </button>
          <button className="doc-header__sair" onClick={logout}>Sair</button>
        </div>
      </header>

      {modal.open && (
        <div className="doc-modal-overlay" onClick={fecharModal}>
          <div className="doc-modal" onClick={e => e.stopPropagation()}>
            {modal.sucesso ? (
              <>
                <h2 className="doc-modal-title">Senha alterada!</h2>
                <p className="doc-modal-desc">
                  Sua senha foi atualizada com sucesso.
                </p>
                <div className="doc-modal-actions">
                  <button className="doc-modal-btn doc-modal-btn--confirm" onClick={fecharModal}>
                    Fechar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="doc-modal-title">Alterar senha</h2>
                <p className="doc-modal-desc">
                  Informe sua senha atual e defina uma nova senha.
                </p>

                <label className="doc-modal-label" htmlFor="doc-senha-antiga">
                  Senha atual <span className="doc-modal-required">*</span>
                </label>
                <div className="doc-modal-pw-wrap">
                  <input
                    id="doc-senha-antiga"
                    className="doc-modal-input"
                    type={modal.verSenhaAntiga ? 'text' : 'password'}
                    placeholder="Digite sua senha atual"
                    value={modal.senhaAntiga}
                    onChange={e => setModal(m => ({ ...m, senhaAntiga: e.target.value, erro: null }))}
                    autoFocus
                    disabled={modal.loading}
                  />
                  <button
                    type="button"
                    className="doc-modal-eye"
                    onClick={() => setModal(m => ({ ...m, verSenhaAntiga: !m.verSenhaAntiga }))}
                    tabIndex={-1}
                  >
                    {modal.verSenhaAntiga ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>

                <label className="doc-modal-label" htmlFor="doc-nova-senha">
                  Nova senha <span className="doc-modal-required">*</span>
                </label>
                <div className="doc-modal-pw-wrap">
                  <input
                    id="doc-nova-senha"
                    className="doc-modal-input"
                    type={modal.verNovaSenha ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={modal.novaSenha}
                    onChange={e => setModal(m => ({ ...m, novaSenha: e.target.value, erro: null }))}
                    disabled={modal.loading}
                  />
                  <button
                    type="button"
                    className="doc-modal-eye"
                    onClick={() => setModal(m => ({ ...m, verNovaSenha: !m.verNovaSenha }))}
                    tabIndex={-1}
                  >
                    {modal.verNovaSenha ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>

                <label className="doc-modal-label" htmlFor="doc-confirmacao">
                  Confirmar nova senha <span className="doc-modal-required">*</span>
                </label>
                <div className="doc-modal-pw-wrap">
                  <input
                    id="doc-confirmacao"
                    className="doc-modal-input"
                    type={modal.verConfirmacao ? 'text' : 'password'}
                    placeholder="Repita a nova senha"
                    value={modal.confirmacao}
                    onChange={e => setModal(m => ({ ...m, confirmacao: e.target.value, erro: null }))}
                    disabled={modal.loading}
                  />
                  <button
                    type="button"
                    className="doc-modal-eye"
                    onClick={() => setModal(m => ({ ...m, verConfirmacao: !m.verConfirmacao }))}
                    tabIndex={-1}
                  >
                    {modal.verConfirmacao ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>

                {modal.erro && <p className="doc-modal-erro">{modal.erro}</p>}

                <div className="doc-modal-actions">
                  <button
                    className="doc-modal-btn doc-modal-btn--cancel"
                    onClick={fecharModal}
                    disabled={modal.loading}
                  >
                    Cancelar
                  </button>
                  <button
                    className="doc-modal-btn doc-modal-btn--confirm"
                    onClick={enviar}
                    disabled={modal.loading}
                  >
                    {modal.loading ? 'Salvando...' : 'Alterar senha'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default DoctorHeader;
