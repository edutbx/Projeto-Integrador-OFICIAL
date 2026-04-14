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

const FORM_INICIAL: PacientePayload = {
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
    } catch (e: any) {
      setErro(e?.message || 'Não foi possível carregar os pacientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPacientes('');
  }, [carregarPacientes]);

  function preencherForm(paciente: Paciente) {
    setEditandoId(paciente.id);
    setForm({
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
    setForm(FORM_INICIAL);
  }

  async function salvarPaciente(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErro(null);

    try {
      const payload: PacientePayload = {
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
    } catch (e: any) {
      setErro(e?.message || 'Falha ao salvar paciente.');
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
    } catch (e: any) {
      setErro(e?.message || 'Falha ao remover paciente.');
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
            <button type="submit" disabled={saving}>
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
            placeholder="Buscar por nome, endereço ou CRM referência"
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
