import React, { useState, useEffect } from 'react';
import './BodyContato.css';

const BodyContato: React.FC = () => {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' });

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada! Entraremos em contato em breve.');
    setForm({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="cont__hero reveal">
        <div className="cont__hero-text">
          <h1 className="cont__hero-title">FALE CONOSCO</h1>
          <p>Nossa equipe está pronta para tirar suas dúvidas e apresentar as melhores soluções para a sua instituição.</p>
        </div>
      </section>

      {/* ── CONTEÚDO ── */}
      <section className="cont__body">
        {/* Formulário */}
        <div className="cont__form-wrap reveal">
          <h2 className="cont__form-title">Envie uma mensagem</h2>
          <form className="cont__form" onSubmit={handleSubmit}>
            <div className="cont__field">
              <label>Nome:</label>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>
            <div className="cont__field">
              <label>E-mail:</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="cont__field">
              <label>Assunto:</label>
              <input
                type="text"
                placeholder="Qual o assunto?"
                value={form.assunto}
                onChange={e => setForm({ ...form, assunto: e.target.value })}
                required
              />
            </div>
            <div className="cont__field">
              <label>Mensagem:</label>
              <textarea
                rows={5}
                placeholder="Descreva sua mensagem..."
                value={form.mensagem}
                onChange={e => setForm({ ...form, mensagem: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="cont__submit">Enviar Mensagem</button>
          </form>
        </div>

        {/* Informações de contato */}
        <div className="cont__info reveal">
          <h2 className="cont__info-title">Informações de Contato</h2>

          <div className="cont__info-card">
            <div className="cont__info-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b6bc8" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <p className="cont__info-label">E-mail</p>
              <p className="cont__info-value">contato@saudemais.com.br</p>
            </div>
          </div>

          <div className="cont__info-card">
            <div className="cont__info-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b6bc8" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
              </svg>
            </div>
            <div>
              <p className="cont__info-label">Telefone</p>
              <p className="cont__info-value">0800 111 2222</p>
            </div>
          </div>

          <div className="cont__info-card">
            <div className="cont__info-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b6bc8" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="cont__info-label">Horário de Atendimento</p>
              <p className="cont__info-value">Segunda a Sexta, 8h às 18h</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BodyContato;
