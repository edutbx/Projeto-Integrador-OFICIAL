import React, { useState } from 'react';
import { register, registerSemSessao } from '../../services/authService';
import '../../styles/layout/BodyCadastro.css';

interface FormData {
  nome: string; sobrenome: string; cpf: string;
  rg: string; dataNascimento: string; sexo: string;
  crm: string; especializacao: string; idGestor: string;
  email: string; senha: string;
  cep: string; logradouro: string; numero: string;
  complemento: string; cidade: string; estado: string;
}
const INITIAL: FormData = {
  nome:'', sobrenome:'', cpf:'', rg:'', dataNascimento:'', sexo:'',
  crm:'', especializacao:'', idGestor:'', email:'', senha:'',
  cep:'', logradouro:'', numero:'', complemento:'', cidade:'', estado:'',
};

// Detecta se o cadastro foi iniciado a partir da área do gestor
const sourceGestor = window.location.search.includes('source=gestor');

const BodyCadastro: React.FC = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const next = () => setStep(s => Math.min(s + 1, 2));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      const payload = {
        nome: form.nome, sobrenome: form.sobrenome, cpf: form.cpf, rg: form.rg,
        dataNascimento: form.dataNascimento, sexo: form.sexo, crm: form.crm,
        especializacao: form.especializacao, idGestor: form.idGestor, email: form.email,
        senha: form.senha, cep: form.cep, logradouro: form.logradouro, numero: form.numero,
        complemento: form.complemento, cidade: form.cidade, estado: form.estado,
      };

      if (sourceGestor) {
        // Modo gestor: registra sem sobrescrever a sessão do gestor
        await registerSemSessao(payload);
      } else {
        await register(payload);
      }
      setSucesso(true);
    } catch (err: any) { setErro(err.message || 'Erro ao cadastrar'); }
    finally { setLoading(false); }
  };

  const voltarDestino = sourceGestor ? '/gestor' : '/';
  const sucessoDestino = sourceGestor ? '/gestor' : '/login';
  const sucessoMensagem = sourceGestor ? 'Médico cadastrado com sucesso!' : 'Cadastro realizado com sucesso!';
  const sucessoSub = sourceGestor ? 'O médico já pode acessar a plataforma.' : 'Agora você pode acessar sua conta';

  return (
    <div className="cad-page__body">
      <h1 className="cad-page__titulo">CADASTRO – MÉDICO</h1>
      <div className="cad-card">
        <div className="cad-progress">
          {[0,1,2].map(i => (
            <React.Fragment key={i}>
              <div className={`cad-progress__dot ${i <= step ? 'cad-progress__dot--active' : ''}`}>{i + 1}</div>
              {i < 2 && <div className={`cad-progress__line ${i < step ? 'cad-progress__line--active' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 0 && (
          <div className="cad-step">
            <h2>Dados Pessoais e de Login</h2>
            <div className="cad-grid">
              <div><label>Nome:</label><input name="nome" value={form.nome} onChange={set} /></div>
              <div><label>Sobrenome:</label><input name="sobrenome" value={form.sobrenome} onChange={set} /></div>
              <div><label>CPF:</label><input name="cpf" value={form.cpf} onChange={set} /></div>
              <div><label>RG:</label><input name="rg" value={form.rg} onChange={set} /></div>
              <div><label>Data de Nascimento:</label><input type="date" name="dataNascimento" value={form.dataNascimento} onChange={set} /></div>
              <div>
                <label>Sexo:</label>
                <select name="sexo" value={form.sexo} onChange={set}>
                  <option value=""></option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>
            <div className="cad-btns">
              <button className="cad-btn cad-btn--outline" onClick={() => window.location.href = voltarDestino}>Voltar</button>
              <button className="cad-btn cad-btn--primary" onClick={next}>Continuar</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="cad-step">
            <h2>Dados Profissionais</h2>
            <div className="cad-grid">
              <div><label>CRM:</label><input name="crm" value={form.crm} onChange={set} /></div>
              <div><label>Especialização:</label><input name="especializacao" value={form.especializacao} onChange={set} /></div>
              <div><label>ID do Gestor:</label><input name="idGestor" value={form.idGestor} onChange={set} /></div>
              <div><label>E-mail:</label><input type="email" name="email" value={form.email} onChange={set} /></div>
              <div><label>Senha:</label><input type="password" name="senha" value={form.senha} onChange={set} /></div>
            </div>
            <div className="cad-btns">
              <button className="cad-btn cad-btn--outline" onClick={prev}>Voltar</button>
              <button className="cad-btn cad-btn--primary" onClick={next}>Continuar</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form className="cad-step" onSubmit={handleFinalizar}>
            <h2>Endereço Profissional</h2>
            <div className="cad-grid">
              <div><label>CEP:</label><input name="cep" value={form.cep} onChange={set} /></div>
              <div><label>Logradouro:</label><input name="logradouro" value={form.logradouro} onChange={set} /></div>
              <div><label>Número:</label><input name="numero" value={form.numero} onChange={set} /></div>
              <div><label>Complemento:</label><input name="complemento" value={form.complemento} onChange={set} /></div>
              <div><label>Cidade:</label><input name="cidade" value={form.cidade} onChange={set} /></div>
              <div><label>Estado:</label>
                  <select name="estado" value={form.estado} onChange={set}>
                  <option value=""></option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                  </select>
              </div>
            </div>
            {erro && <p className="cad-erro">{erro}</p>}
            <div className="cad-btns">
              <button type="button" className="cad-btn cad-btn--outline" onClick={prev}>Voltar</button>
              <button type="submit" className="cad-btn cad-btn--primary" disabled={loading}>{loading ? 'Cadastrando...' : 'Finalizar'}</button>
            </div>
          </form>
        )}

        {sucesso && (
          <div className="cad-sucesso-overlay">
            <div className="cad-sucesso-box">
              <div className="cad-sucesso-icon">
                <svg viewBox="0 0 48 48" fill="none" width="56" height="56">
                  <circle cx="24" cy="24" r="24" fill="#f4a623"/>
                  <polyline points="14,24 21,32 35,16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>{sucessoMensagem}</h3>
              <p>{sucessoSub}</p>
              <button className="cad-btn cad-btn--primary" style={{width:'60%'}} onClick={() => window.location.href = sucessoDestino}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BodyCadastro;
