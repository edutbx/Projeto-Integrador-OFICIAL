import React, { useState } from 'react';
import { loginGestor } from '../../services/authService';
import '../../styles/layout/BodyLoginGestor.css';

const BodyLoginGestor: React.FC = () => {
  const [email, setEmail]   = useState('');
  const [senha, setSenha]   = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await loginGestor(email, senha);
      window.location.href = '/gestor';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Credenciais inválidas';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page__body">
      {/* Painel esquerdo */}
      <div className="lg-page__left">
        <h2 className="lg-page__left-title">ACESSO EXCLUSIVO</h2>
        <p>Esta área é destinada exclusivamente aos gestores da plataforma Saúde++.</p>
        <p>Se você é um médico, utilize o acesso adequado para o seu perfil.</p>
        <a href="/entrar" className="lg-page__left-btn">Ver todos os acessos</a>
      </div>

      {/* Painel direito */}
      <div className="lg-page__right">
        <div className="lg-box">
          <h1 className="lg-box__title">GESTOR</h1>
          <form onSubmit={handleSubmit}>
            <div className="lg-box__field">
              <label htmlFor="email"><strong>E-mail:</strong></label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="lg-box__field">
              <label htmlFor="senha-gestor"><strong>Senha:</strong></label>
              <div className="lg-box__pw-wrap">
                <input
                  id="senha-gestor"
                  type={verSenha ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
                <button type="button" className="lg-box__eye" onClick={() => setVerSenha(!verSenha)}>
                  {verSenha
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  }
                </button>
              </div>
            </div>
            {erro && <p className="lg-box__erro">{erro}</p>}
            <button type="submit" className="lg-box__submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p className="lg-box__terms">
            Ao entrar, você concorda com os <a href="/">Termos de Uso</a> e com as <a href="/">Políticas de Privacidade.</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodyLoginGestor;
