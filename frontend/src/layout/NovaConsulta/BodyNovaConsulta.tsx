import React, { useEffect, useMemo, useState } from 'react';
import { Paciente } from '../../types';
import { listarPacientesComoMedico } from '../../services/pacienteService';
import '../../styles/layout/BodyNovaConsulta.css';

const BodyNovaConsulta: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarPacientesComoMedico('');
        setPacientes(data.pacientes ?? []);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const pacientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return pacientes;
    return pacientes.filter(p =>
      p.nome.toLowerCase().includes(termo) ||
      p.endereco.toLowerCase().includes(termo)
    );
  }, [busca, pacientes]);

  const iniciar = (pacienteId: string) => {
    if (!pacienteId) return;
    window.location.href = `/prontuario?pacienteId=${pacienteId}`;
  };

  return (
    <main className="nc-main">
      <input
        className="nc-cpf"
        type="text"
        placeholder="Buscar paciente por nome ou endereço"
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />
      <div className="nc-iniciar-row">
        <button className="nc-iniciar-btn" onClick={() => { if (pacientesFiltrados[0]) iniciar(pacientesFiltrados[0].id); }} disabled={!pacientesFiltrados.length}>
          INICIAR COM O PRIMEIRO DA LISTA
        </button>
        <img src="/img/bonecosLogo.png" alt="" className="nc-bonecos" />
      </div>

      <div className="nc-lista-wrap">
        {loading ? (
          <p className="nc-lista-empty">Carregando pacientes...</p>
        ) : pacientesFiltrados.length === 0 ? (
          <p className="nc-lista-empty">Nenhum paciente encontrado.</p>
        ) : (
          pacientesFiltrados.map(p => (
            <button key={p.id} className="nc-paciente-item" onClick={() => iniciar(p.id)}>
              <strong>{p.nome}</strong>
              <span>{p.idade} anos · {p.endereco}</span>
            </button>
          ))
        )}
      </div>

      <button className="nc-voltar" onClick={() => window.location.href = '/medico'}>Voltar</button>
    </main>
  );
};
export default BodyNovaConsulta;
