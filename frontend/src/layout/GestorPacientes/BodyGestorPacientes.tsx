import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Paciente, PacientePayload } from '../../types';
import {
  atualizarPaciente,
  criarPaciente,
  deletarPaciente,
  listarPacientesComoGestor,
} from '../../services/pacienteService';
import '../../styles/layout/BodyGestor.css';
import '../../styles/layout/BodyGestorPacientes.css';

const path = window.location.pathname;

function formatarCpf(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

function validarCpf(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
  let r = sum % 11;
  const v1 = r < 2 ? 0 : 11 - r;
  if (v1 !== parseInt(d[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
  r = sum % 11;
  const v2 = r < 2 ? 0 : 11 - r;
  return v2 === parseInt(d[10]);
}

const FORM_INICIAL: PacientePayload = {
  cpf: '',
  nome: '',
  idade: 0,
  endereco: '',
  altura: 0,
  peso: 0,
  medicoCrmReferencia: '',
};

const BodyGestorPacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [cpfErro, setCpfErro] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<PacientePayload>(FORM_INICIAL);
  const [formAberto, setFormAberto] = useState(false);

  const tituloFormulario = useMemo(
    () => (editandoId ? 'Atualizar paciente' : 'Cadastrar paciente'),
    [editandoId]
  );

  const carregarPacientes = useCallback(async (termo = '') => {
    setLoading(true);
    setErro(null);
    try {
      const data = await listarPacientesComoGestor(termo);
      setPacientes(data.pacientes ?? []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Não foi possível carregar os pacientes.';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPacientes('');
  }, [carregarPacientes]);

  function abrirFormulario() {
    setEditandoId(null);
    setCpfErro(null);
    setErro(null);
    setForm(FORM_INICIAL);
    setFormAberto(true);
  }

  function limparFormulario() {
    setEditandoId(null);
    setCpfErro(null);
    setErro(null);
    setForm(FORM_INICIAL);
    setFormAberto(false);
  }

  function preencherForm(paciente: Paciente) {
    setEditandoId(paciente.id);
    setCpfErro(null);
    setErro(null);
    setForm({
      cpf: formatarCpf(paciente.cpf || ''),
      nome: paciente.nome,
      idade: paciente.idade,
      endereco: paciente.endereco,
      altura: paciente.altura,
      peso: paciente.peso,
      medicoCrmReferencia: paciente.medicoCrmReferencia || '',
    });
    setFormAberto(true);
  }

  function handleCpfChange(value: string) {
    const formatted = formatarCpf(value);
    setForm(v => ({ ...v, cpf: formatted }));
    if (formatted.replace(/\D/g, '').length === 11) {
      setCpfErro(validarCpf(formatted) ? null : 'CPF inválido');
    } else {
      setCpfErro(null);
    }
  }

  async function salvarPaciente(e: React.FormEvent) {
    e.preventDefault();
    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (!validarCpf(cpfDigits)) {
      setCpfErro('CPF inválido');
      return;
    }
    setSaving(true);
    setErro(null);

    try {
      const payload: PacientePayload = {
        cpf: cpfDigits,
        nome: form.nome.trim(),
        idade: Number(form.idade),
        endereco: form.endereco.trim(),
        altura: Number(form.altura),
        peso: Number(form.peso),
        medicoCrmReferencia: (form.medicoCrmReferencia || '').trim(),
      };

      if (editandoId) {
        await atualizarPaciente(editandoId, payload);
      } else {
        await criarPaciente(payload);
      }

      limparFormulario();
      await carregarPacientes('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Falha ao salvar paciente.';
      setErro(msg);
    } finally {
      setSaving(false);
    }
  }

  async function remover(id: string) {
    const confirmar = window.confirm('Deseja realmente excluir este paciente?');
    if (!confirmar) return;

    setErro(null);
    try {
      await deletarPaciente(id);
      await carregarPacientes(busca);
      if (editandoId === id) limparFormulario();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Falha ao remover paciente.';
      setErro(msg);
    }
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

      <section className="gestor-content gpac">

        <div className="gpac__header">
          <h1>Pacientes</h1>
          <button className="gpac__btn-novo" onClick={abrirFormulario}>
            + Cadastrar paciente
          </button>
        </div>

        <div className="gpac__search">
          <input
            type="text"
            placeholder="Buscar por nome, CPF, endereço ou CRM referência"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <button type="button" onClick={() => carregarPacientes(busca)}>
            Buscar
          </button>
        </div>

        {erro && <p className="gpac__erro">{erro}</p>}

        {loading ? (
          <p className="gpac__loading">Carregando pacientes...</p>
        ) : (
          <div className="gpac__table-wrap">
            <table className="gpac__table">
              <thead>
                <tr>
                  <th>CPF</th>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Endereço</th>
                  <th>Altura</th>
                  <th>Peso</th>
                  <th>Médico referência</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map(p => (
                  <tr key={p.id}>
                    <td>{formatarCpf(p.cpf || '')}</td>
                    <td>{p.nome}</td>
                    <td>{p.idade}</td>
                    <td>{p.endereco}</td>
                    <td>{p.altura}</td>
                    <td>{p.peso}</td>
                    <td>{p.medicoCrmReferencia || '—'}</td>
                    <td>
                      <div className="gpac__row-actions">
                        <button type="button" className="gpac__btn-edit" onClick={() => preencherForm(p)}>Editar</button>
                        <button
                          type="button"
                          className="gpac__btn-prontuario"
                          onClick={() => (window.location.href = `/gestor/pacientes/prontuario?pacienteId=${p.id}`)}
                        >
                          Prontuário
                        </button>
                        <button type="button" className="gpac__btn-danger" onClick={() => remover(p.id)}>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>

      {formAberto && (
        <div className="gpac__modal-overlay" onClick={() => { if (!saving) limparFormulario(); }}>
          <div className="gpac__modal" onClick={e => e.stopPropagation()}>
            <h2 className="gpac__modal-title">{tituloFormulario}</h2>
            <form onSubmit={salvarPaciente}>
              <div className="gpac__form-grid">

                <div className="gpac__field">
                  <label className="gpac__label">CPF *</label>
                  <input
                    type="text"
                    value={form.cpf}
                    onChange={e => handleCpfChange(e.target.value)}
                    maxLength={14}
                    required
                  />
                  {cpfErro && <span className="gpac__field-erro">{cpfErro}</span>}
                </div>

                <div className="gpac__field">
                  <label className="gpac__label">Nome *</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={e => setForm(v => ({ ...v, nome: e.target.value }))}
                    required
                  />
                </div>

                <div className="gpac__field">
                  <label className="gpac__label">Idade *</label>
                  <input
                    type="number"
                    value={form.idade || ''}
                    onChange={e => setForm(v => ({ ...v, idade: Number(e.target.value) }))}
                    min={0}
                    required
                  />
                </div>

                <div className="gpac__field">
                  <label className="gpac__label">Endereço *</label>
                  <input
                    type="text"
                    value={form.endereco}
                    onChange={e => setForm(v => ({ ...v, endereco: e.target.value }))}
                    required
                  />
                </div>

                <div className="gpac__field">
                  <label className="gpac__label">Altura (m) *</label>
                  <input
                    type="number"
                    value={form.altura || ''}
                    onChange={e => setForm(v => ({ ...v, altura: Number(e.target.value) }))}
                    min={0.01}
                    step={0.01}
                    required
                  />
                </div>

                <div className="gpac__field">
                  <label className="gpac__label">Peso (kg) *</label>
                  <input
                    type="number"
                    value={form.peso || ''}
                    onChange={e => setForm(v => ({ ...v, peso: Number(e.target.value) }))}
                    min={0.1}
                    step={0.1}
                    required
                  />
                </div>

                <div className="gpac__field gpac__field--full">
                  <label className="gpac__label">CRM médico referência</label>
                  <input
                    type="text"
                    value={form.medicoCrmReferencia || ''}
                    onChange={e => setForm(v => ({ ...v, medicoCrmReferencia: e.target.value }))}
                  />
                </div>

              </div>

              {erro && <p className="gpac__erro">{erro}</p>}

              <div className="gpac__actions">
                <button
                  type="button"
                  className="gpac__btn-outline"
                  onClick={limparFormulario}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="gpac__btn-primary"
                  disabled={saving || !!cpfErro}
                >
                  {saving ? 'Salvando...' : editandoId ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default BodyGestorPacientes;
