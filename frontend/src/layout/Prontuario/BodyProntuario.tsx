import React, { useState } from 'react';
import LoadingOverlay from '../../componets/LoadingOverlay/LoadingOverlay';
import { interpretarPdf } from '../../services/apiService';
import './BodyProntuario.css';

const PatientPhoto: React.FC = () => (
  <div className="pront-avatar"><img src="/img/icon.png" alt="paciente" /></div>
);

const BodyProntuario: React.FC = () => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInterpretarPdf = async () => {
    if (!arquivo) { alert('Selecione um arquivo PDF!'); return; }
    setLoading(true); setResposta('');
    try {
      const res = await interpretarPdf(arquivo);
      let txt = '';
      if (res.respostaIA) { try { txt = JSON.parse(res.respostaIA).resposta || res.respostaIA; } catch { txt = res.respostaIA; } }
      else if (res.erroIA) { txt = res.erroIA; }
      else { txt = 'Nenhuma resposta da IA.'; }
      setResposta(txt);
    } catch { setResposta('Erro ao processar o arquivo.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <main className="pront-main">
        <aside className="pront-sidebar">
          <div className="pront-sidebar__meta"><p>Data: 10/10/2025&nbsp;&nbsp;Horário: 10:20h</p></div>
          <PatientPhoto />
          <div className="pront-sidebar__dados">
            <p><span className="pront-label">Paciente:</span> Carolina Sato</p>
            <p><span className="pront-label">Idade:</span> 25 anos</p>
            <p><span className="pront-label">Sexo:</span> Feminino</p>
            <p><span className="pront-label">CPF:</span> 333.333.333-33</p>
            <p><span className="pront-label">Endereço:</span> Rua das Flores, 513<br/>Centro – São Paulo</p>
            <p><span className="pront-label">Telefone:</span> (11) 970154684</p>
            <p><span className="pront-label">Histórico Médico:</span> Hipertensão, Alergia à Dipirona</p>
          </div>
        </aside>
        <section className="pront-conteudo">
          <div className="pront-acoes">
            <button className="pront-btn" onClick={() => alert('Funcionalidade em desenvolvimento')}>
              CONSULTAR PRONTUÁRIOS ANTIGOS<img src="/img/bonecosLogo.png" alt="" className="pront-btn__ic" />
            </button>
            <button className="pront-btn" onClick={handleInterpretarPdf} disabled={!arquivo}>
              INTERPRETAR PRONTUÁRIO<img src="/img/bonecosLogo.png" alt="" className="pront-btn__ic" />
            </button>
            <label className="pront-file-label">
              {arquivo ? arquivo.name : 'Escolher Arquivo'}
              <input type="file" accept="application/pdf" onChange={e => setArquivo(e.target.files?.[0] || null)} style={{ display: 'none' }} />
            </label>
          </div>
          <div className="pront-resultado">
            {resposta
              ? <div className="pront-resultado__texto">{resposta}</div>
              : <div className="pront-resultado__placeholder"><img src="/img/bonecosLogo.png" alt="" style={{ width: 120, opacity: .7 }} /></div>
            }
          </div>
        </section>
      </main>
      <LoadingOverlay ativo={loading} />
    </>
  );
};
export default BodyProntuario;
