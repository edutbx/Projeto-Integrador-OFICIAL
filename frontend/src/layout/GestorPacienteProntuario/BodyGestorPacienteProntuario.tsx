import React, { useEffect, useMemo, useState } from 'react';
import { Paciente, Prontuario, ProntuarioPayload } from '../../types';
import { buscarPacienteComoGestor } from '../../services/pacienteService';
import {
  criarProntuarioParaPaciente,
  obterProntuarioPorPacienteComoGestor,
  atualizarProntuario,
} from '../../services/prontuarioService';
import '../../styles/layout/BodyGestor.css';
import '../../styles/layout/BodyGestorPacienteProntuario.css';

const path = window.location.pathname;

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

const BodyGestorPacienteProntuario: React.FC = () => {
  const pacienteId = new URLSearchParams(window.location.search).get('pacienteId') || '';
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [form, setForm] = useState<ProntuarioPayload>(FORM_INICIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const titulo = useMemo(
    () => (prontuario ? 'Editar prontuário' : 'Criar prontuário inicial'),
    [prontuario]
  );

  useEffect(() => {
    if (!pacienteId) {
      setErro('Paciente não informado.');
      setLoading(false);
      return;
    }

    async function carregar() {
      setLoading(true);
      setErro(null);
      try {
        const pacienteData = await buscarPacienteComoGestor(pacienteId);
        setPaciente(pacienteData);

        try {
          const prontuarioData = await obterProntuarioPorPacienteComoGestor(pacienteId);
          setProntuario(prontuarioData);
          setForm({
            resumoProblema: prontuarioData.resumoProblema || '',
            historicoDoencaAtual: prontuarioData.historicoDoencaAtual || '',
            sintomasRelatados: prontuarioData.sintomasRelatados || '',
            alergias: prontuarioData.alergias || '',
            medicamentosEmUso: prontuarioData.medicamentosEmUso || '',
            hipoteseDiagnostica: prontuarioData.hipoteseDiagnostica || '',
            condutaMedica: prontuarioData.condutaMedica || '',
            examesSolicitados: prontuarioData.examesSolicitados || '',
            observacoesGerais: prontuarioData.observacoesGerais || '',
          });
        } catch {
          setProntuario(null);
          setForm(FORM_INICIAL);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Erro ao carregar dados do paciente.';
        setErro(msg);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [pacienteId]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!pacienteId) return;

    setSaving(true);
    setErro(null);
    try {
      const payload: ProntuarioPayload = {
        resumoProblema: form.resumoProblema?.trim() || '',
        historicoDoencaAtual: form.historicoDoencaAtual?.trim() || '',
        sintomasRelatados: form.sintomasRelatados?.trim() || '',
        alergias: form.alergias?.trim() || '',
        medicamentosEmUso: form.medicamentosEmUso?.trim() || '',
        hipoteseDiagnostica: form.hipoteseDiagnostica?.trim() || '',
        condutaMedica: form.condutaMedica?.trim() || '',
        examesSolicitados: form.examesSolicitados?.trim() || '',
        observacoesGerais: form.observacoesGerais?.trim() || '',
      };

      const salvo = prontuario
        ? await atualizarProntuario(prontuario.id, payload)
        : await criarProntuarioParaPaciente(pacienteId, payload);

      setProntuario(salvo);
      alert('Prontuário salvo com sucesso.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar prontuário.';
      setErro(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="gestor-main">
      <aside className="gestor-sidebar">
        <nav className="gestor-nav">
          <a href="/gestor" className={`gestor-nav__item ${path === '/gestor' ? 'gestor-nav__item--active' : ''}`}>
            Dashboard
          </a>
          <a href="/gestor/medicos" className={`gestor-nav__item ${path === '/gestor/medicos' ? 'gestor-nav__item--active' : ''}`}>
            Médicos
          </a>
          <a href="/gestor/pacientes" className={`gestor-nav__item ${path.includes('/gestor/pacientes') ? 'gestor-nav__item--active' : ''}`}>
            Pacientes
          </a>
        </nav>
      </aside>

      <section className="gestor-content gpp">
        <h1>{titulo}</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {paciente && (
              <div className="gpp__paciente-card">
                <h2>Paciente selecionado</h2>
                <p><strong>Nome:</strong> {paciente.nome}</p>
                <p><strong>Idade:</strong> {paciente.idade}</p>
                <p><strong>Endereço:</strong> {paciente.endereco}</p>
                <p><strong>Altura:</strong> {paciente.altura}</p>
                <p><strong>Peso:</strong> {paciente.peso}</p>
              </div>
            )}

            <form className="gpp__form" onSubmit={salvar}>
              <textarea
                placeholder="Resumo do problema *"
                value={form.resumoProblema}
                onChange={e => setForm(v => ({ ...v, resumoProblema: e.target.value }))}
                required
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

              {erro && <p className="gpp__erro">{erro}</p>}

              <div className="gpp__actions">
                <button type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar prontuário'}
                </button>
                <button type="button" className="gpp__btn-sec" onClick={() => (window.location.href = '/gestor/pacientes')}>
                  Voltar para pacientes
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </main>
  );
};

export default BodyGestorPacienteProntuario;
