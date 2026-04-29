import React, { useState } from 'react';
import { login } from '../../services/authService';
import { enviarSolicitacao } from '../../services/notificacaoService';
import '../../styles/layout/BodyLogin.css';

const BodyLogin: React.FC = () => {
  const [crm, setCrm]           = useState('');
  const [senha, setSenha]       = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro]         = useState('');
  const [loading, setLoading]   = useState(false);

  // Estado do modal
  const [modalAberto, setModalAberto] = useState(false);
  const [mNome, setMNome]             = useState('');
  const [mEmail, setMEmail]           = useState('');
  const [mCrm, setMCrm]               = useState('');
  const [mMensagem, setMMensagem]     = useState('');
  const [mEnviando, setMEnviando]     = useState(false);
  const [mSucesso, setMSucesso]       = useState(false);
  const [mErro, setMErro]             = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      await login(crm, senha);
      window.location.href = '/medico';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Credenciais inválidas';
      setErro(msg);
    } finally { setLoading(false); }
  };

  const abrirModal = () => {
    setModalAberto(true);
    setMSucesso(false); setMErro('');
    setMNome(''); setMEmail(''); setMCrm(''); setMMensagem('');
  };

  const fecharModal = () => { setModalAberto(false); setMSucesso(false); };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMEnviando(true); setMErro('');
    try {
      await enviarSolicitacao({ nomeRemetente: mNome, emailRemetente: mEmail, crm: mCrm, mensagem: mMensagem });
      setMSucesso(true);
    } catch {
      setMErro('Erro ao enviar. Tente novamente.');
    } finally { setMEnviando(false); }
  };

  return (
    <>
      <div className="login-page__body">
        {/* Painel esquerdo */}
        <div className="login-page__left">
          <h2 className="login-page__left-title">PRIMEIRO ACESSO?</h2>
          <p>Seu cadastro será realizado pelo gestor do sistema.</p>
          <p>Assim que o cadastro for feito, você receberá seus dados de acesso por email.</p>
          <button className="login-page__left-btn" onClick={abrirModal}>Solicitar cadastro</button>
        </div>

        {/* Painel direito — formulário de login */}
        <div className="login-page__right">
          <div className="login-box">
            <h1 className="login-box__title">LOGIN</h1>
            <form onSubmit={handleSubmit}>
              <div className="login-box__field">
                <label htmlFor="crm"><strong>CRM:</strong></label>
                <input id="crm" type="text" placeholder="Digite seu CRM" value={crm} onChange={e => setCrm(e.target.value)} required />
              </div>
              <div className="login-box__field">
                <label htmlFor="senha"><strong>Senha:</strong></label>
                <div className="login-box__pw-wrap">
                  <input id="senha" type={verSenha ? 'text' : 'password'} placeholder="Digite sua senha" value={senha} onChange={e => setSenha(e.target.value)} required />
                  <button type="button" className="login-box__eye" onClick={() => setVerSenha(!verSenha)}>
                    {verSenha
                      ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    }
                  </button>
                </div>
              </div>
              {erro && <p className="login-box__erro">{erro}</p>}
              <button type="submit" className="login-box__submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
              <a href="/" className="login-box__forgot">Esqueceu sua senha?</a>
            </form>
            <p className="login-box__terms">
              Ao entrar, você concorda com os <a href="/">Termos de Uso</a> e com as <a href="/">Políticas de Privacidade.</a>
            </p>
          </div>
        </div>
      </div>

      {/* Modal de solicitação de cadastro */}
      {modalAberto && (
        <div className="solicit-overlay" onClick={e => { if (e.target === e.currentTarget) fecharModal(); }}>
          <div className="solicit-modal">
            <button className="solicit-modal__close" onClick={fecharModal}>×</button>

            {mSucesso ? (
              <div className="solicit-modal__sucesso">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <circle cx="26" cy="26" r="26" fill="#e8f5e9"/>
                  <path d="M15 26l8 8 14-14" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Solicitação enviada!</h3>
                <p>O gestor do sistema foi notificado e realizará seu cadastro em breve. Você receberá seus dados de acesso por email.</p>
                <button className="solicit-modal__ok" onClick={fecharModal}>Ok, entendi</button>
              </div>
            ) : (
              <>
                <h2 className="solicit-modal__title">Solicitar Cadastro</h2>
                <p className="solicit-modal__sub">Preencha seus dados. O gestor será notificado para realizar seu cadastro na plataforma.</p>
                <form onSubmit={handleEnviar}>
                  <div className="solicit-modal__field">
                    <label>Nome completo *</label>
                    <input type="text" placeholder="Seu nome completo" value={mNome} onChange={e => setMNome(e.target.value)} required />
                  </div>
                  <div className="solicit-modal__field">
                    <label>E-mail *</label>
                    <input type="email" placeholder="seu@email.com" value={mEmail} onChange={e => setMEmail(e.target.value)} required />
                  </div>
                  <div className="solicit-modal__field">
                    <label>CRM *</label>
                    <input type="text" placeholder="Seu CRM" value={mCrm} onChange={e => setMCrm(e.target.value)} required />
                  </div>
                  <div className="solicit-modal__field">
                    <label>Mensagem (opcional)</label>
                    <textarea placeholder="Informações adicionais..." value={mMensagem} onChange={e => setMMensagem(e.target.value)} rows={3} />
                  </div>
                  {mErro && <p className="solicit-modal__erro">{mErro}</p>}
                  <div className="solicit-modal__actions">
                    <button type="button" className="solicit-modal__cancel" onClick={fecharModal}>Cancelar</button>
                    <button type="submit" className="solicit-modal__send" disabled={mEnviando}>
                      {mEnviando ? 'Enviando...' : 'Enviar solicitação'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default BodyLogin;
