import React, { useState } from 'react';
import { login } from '../../services/authService';
import './BodyLogin.css';

const BodyLogin: React.FC = () => {
  const [crm, setCrm] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      await login(crm, senha);
      window.location.href = '/medico';
    } catch (err: any) {
      setErro(err.message || 'Credenciais inválidas');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page__body">
      <div className="login-page__left">
        <h2 className="login-page__left-title">PRIMEIRO ACESSO?</h2>
        <p>Seu cadastro será realizado pelo gestor do sistema.</p>
        <p>Assim que o cadastro for feito, você receberá seus dados de acesso por email.</p>
        <a href="/cadastro" className="login-page__left-btn">Solicitar cadastro</a>
      </div>
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
  );
};
export default BodyLogin;
