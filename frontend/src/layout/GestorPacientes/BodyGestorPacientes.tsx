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

  function preencherForm(paciente: Paciente) {
    setEditandoId(paciente.id);
    setCpfErro(null);
    setForm({
      cpf: formatarCpf(paciente.cpf || ''),
      nome: paciente.nome,
      idade: paciente.idade,
      endereco: paciente.endereco,
      altura: paciente.altura,
      peso: paciente.peso,
      medicoCrmReferencia: paciente.medicoCrmReferencia || '',
    });
  }

  function limparFormulario() {
    setEditandoId(null);
    setCpfErro(null);
    setForm(FORM_INICIAL);
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
        <h1>Pacientes</h1>

        <form className="gpac__form" onSubmit={salvarPaciente}>
          <h2>{tituloFormulario}</h2>
          <div className="gpac__form-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <input
                type="text"
                placeholder="CPF (somente números)"
                value={form.cpf}
                onChange={e => handleCpfChange(e.target.value)}
                maxLength={14}
                required
              />
              {cpfErro && <span style={{ color: '#dc2626', fontSize: '0.78rem' }}>{cpfErro}</span>}
            </div>
            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={e => setForm(v => ({ ...v, nome: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Idade"
              value={form.idade || ''}
              onChange={e => setForm(v => ({ ...v, idade: Number(e.target.value) }))}
              min={0}
              required
            />
            <input
              type="text"
              placeholder="Endereço"
              value={form.endereco}
              onChange={e => setForm(v => ({ ...v, endereco: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Altura (m)"
              value={form.altura || ''}
              onChange={e => setForm(v => ({ ...v, altura: Number(e.target.value) }))}
              min={0.01}
              step={0.01}
              required
            />
            <input
              type="number"
              placeholder="Peso (kg)"
              value={form.peso || ''}
              onChange={e => setForm(v => ({ ...v, peso: Number(e.target.value) }))}
              min={0.1}
              step={0.1}
              required
            />
            <input
              type="text"
              placeholder="CRM médico referência (opcional)"
              value={form.medicoCrmReferencia || ''}
              onChange={e => setForm(v => ({ ...v, medicoCrmReferencia: e.target.value }))}
            />
          </div>

          <div className="gpac__actions">
            <button type="submit" disabled={saving || !!cpfErro}>
              {saving ? 'Salvando...' : editandoId ? 'Atualizar' : 'Cadastrar'}
            </button>
            {editandoId && (
              <button type="button" className="gpac__btn-secondary" onClick={limparFormulario}>
                Cancelar edição
              </button>
            )}
          </div>
        </form>

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
          <p>Carregando pacientes...</p>
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
                        <button type="button" onClick={() => preencherForm(p)}>Editar</button>
                        <button
                          type="button"
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
    </main>
  );
};

export default BodyGestorPacientes;
