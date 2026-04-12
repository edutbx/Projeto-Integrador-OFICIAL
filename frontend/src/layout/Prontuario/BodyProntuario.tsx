import React, { useEffect, useState } from 'react';
import LoadingOverlay from '../../componets/LoadingOverlay/LoadingOverlay';
import { Prontuario, ProntuarioPayload } from '../../types';
import { obterProntuarioPorPacienteComoMedico, atualizarProntuario, interpretarProntuarioIa } from '../../services/prontuarioService';
import '../../styles/layout/BodyProntuario.css';

const PatientPhoto: React.FC = () => (
  <div className="pront-avatar"><img src="/img/icon.png" alt="paciente" /></div>
);

const FORM_INICIAL: ProntuarioPayload = {
  resumoProblema: '',
  historicoDoencaAtual: '',
  sintomasRelatados: '',
  alergias: '',
  medicamentosEmUso: '',
  hipoteseDiagnostica: '',
  condutaMedica: '',
  examesSolicitados: '',
  observacoesGerais: '',
};

const BodyProntuario: React.FC = () => {
  const pacienteId = new URLSearchParams(window.location.search).get('pacienteId') || '';
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [form, setForm] = useState<ProntuarioPayload>(FORM_INICIAL);
  const [respostaIa, setRespostaIa] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pacienteId) {
      setErro('Paciente não informado para a consulta.');
      return;
    }

    async function carregar() {
      setLoading(true);
      setErro('');
      try {
        const data = await obterProntuarioPorPacienteComoMedico(pacienteId);
        setProntuario(data);
        setRespostaIa(data.interpretacaoIa || '');
        setForm({
          resumoProblema: data.resumoProblema || '',
          historicoDoencaAtual: data.historicoDoencaAtual || '',
          sintomasRelatados: data.sintomasRelatados || '',
          alergias: data.alergias || '',
          medicamentosEmUso: data.medicamentosEmUso || '',
          hipoteseDiagnostica: data.hipoteseDiagnostica || '',
          condutaMedica: data.condutaMedica || '',
          examesSolicitados: data.examesSolicitados || '',
          observacoesGerais: data.observacoesGerais || '',
        });
      } catch (e: any) {
        setErro(e?.message || 'Prontuário não disponível para este paciente.');
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [pacienteId]);

  const salvarProntuario = async () => {
    if (!prontuario) return;
    setLoading(true);
    setErro('');
    try {
      const salvo = await atualizarProntuario(prontuario.id, {
        resumoProblema: form.resumoProblema?.trim() || '',
        historicoDoencaAtual: form.historicoDoencaAtual?.trim() || '',
        sintomasRelatados: form.sintomasRelatados?.trim() || '',
        alergias: form.alergias?.trim() || '',
        medicamentosEmUso: form.medicamentosEmUso?.trim() || '',
        hipoteseDiagnostica: form.hipoteseDiagnostica?.trim() || '',
        condutaMedica: form.condutaMedica?.trim() || '',
        examesSolicitados: form.examesSolicitados?.trim() || '',
        observacoesGerais: form.observacoesGerais?.trim() || '',
      });
      setProntuario(salvo);
      alert('Prontuário atualizado com sucesso.');
    } catch (e: any) {
      setErro(e?.message || 'Erro ao atualizar prontuário.');
    } finally {
      setLoading(false);
    }
  };

  const interpretarIa = async () => {
    if (!prontuario) return;
    setLoading(true);
    setErro('');
    try {
      const resposta = await interpretarProntuarioIa(prontuario.id);
      let txt = resposta;
      try {
        const parsed = JSON.parse(resposta);
        txt = parsed.resposta || resposta;
      } catch {
        txt = resposta;
      }
      setRespostaIa(txt);
    } catch (e: any) {
      setErro(e?.message || 'Erro ao interpretar com IA.');
    }
    finally { setLoading(false); }
  };

  return (
    <>
      <main className="pront-main">
        <aside className="pront-sidebar">
          <div className="pront-sidebar__meta"><p>Consulta em andamento</p></div>
          <PatientPhoto />
          {prontuario && (
            <div className="pront-sidebar__dados">
              <p><span className="pront-label">Paciente:</span> {prontuario.pacienteNome}</p>
              <p><span className="pront-label">Idade:</span> {prontuario.pacienteIdade} anos</p>
              <p><span className="pront-label">Endereço:</span> {prontuario.pacienteEndereco}</p>
              <p><span className="pront-label">Altura:</span> {prontuario.pacienteAltura}</p>
              <p><span className="pront-label">Peso:</span> {prontuario.pacientePeso}</p>
            </div>
          )}
        </aside>
        <section className="pront-conteudo">
          <div className="pront-acoes">
            <button className="pront-btn" onClick={salvarProntuario} disabled={!prontuario || !form.resumoProblema?.trim()}>
              SALVAR PRONTUÁRIO<img src="/img/bonecosLogo.png" alt="" className="pront-btn__ic" />
            </button>
            <button className="pront-btn" onClick={interpretarIa} disabled={!prontuario}>
              INTERPRETAR COM IA<img src="/img/bonecosLogo.png" alt="" className="pront-btn__ic" />
            </button>
          </div>

          {prontuario && (
            <div className="pront-form-grid">
              <textarea
                placeholder="Resumo do problema *"
                value={form.resumoProblema}
                onChange={e => setForm(v => ({ ...v, resumoProblema: e.target.value }))}
              />
              <textarea
                placeholder="Histórico da doença atual"
                value={form.historicoDoencaAtual}
                onChange={e => setForm(v => ({ ...v, historicoDoencaAtual: e.target.value }))}
              />
              <textarea
                placeholder="Sintomas relatados"
                value={form.sintomasRelatados}
                onChange={e => setForm(v => ({ ...v, sintomasRelatados: e.target.value }))}
              />
              <textarea
                placeholder="Alergias"
                value={form.alergias}
                onChange={e => setForm(v => ({ ...v, alergias: e.target.value }))}
              />
              <textarea
                placeholder="Medicamentos em uso"
                value={form.medicamentosEmUso}
                onChange={e => setForm(v => ({ ...v, medicamentosEmUso: e.target.value }))}
              />
              <textarea
                placeholder="Hipótese diagnóstica"
                value={form.hipoteseDiagnostica}
                onChange={e => setForm(v => ({ ...v, hipoteseDiagnostica: e.target.value }))}
              />
              <textarea
                placeholder="Conduta médica"
                value={form.condutaMedica}
                onChange={e => setForm(v => ({ ...v, condutaMedica: e.target.value }))}
              />
              <textarea
                placeholder="Exames solicitados"
                value={form.examesSolicitados}
                onChange={e => setForm(v => ({ ...v, examesSolicitados: e.target.value }))}
              />
              <textarea
                placeholder="Observações gerais"
                value={form.observacoesGerais}
                onChange={e => setForm(v => ({ ...v, observacoesGerais: e.target.value }))}
              />
            </div>
          )}

          {erro && <p className="pront-erro">{erro}</p>}

          {!prontuario && !loading && !erro && (
            <p className="pront-erro">Nenhum prontuário encontrado para este paciente.</p>
          )}

          <div className="pront-resultado">
            {respostaIa
              ? <div className="pront-resultado__texto">{respostaIa}</div>
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
