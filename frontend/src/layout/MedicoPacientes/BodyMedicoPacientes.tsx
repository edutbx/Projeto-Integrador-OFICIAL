import React, { useCallback, useEffect, useState } from 'react';
import { Paciente } from '../../types';
import { listarPacientesComoMedico } from '../../services/pacienteService';
import '../../styles/layout/BodyMedicoPacientes.css';

const BodyMedicoPacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async (termo = '') => {
    setLoading(true);
    setErro(null);
    try {
      const data = await listarPacientesComoMedico(termo);
      setPacientes(data.pacientes ?? []);
    } catch (e: any) {
      setErro(e?.message || 'Não foi possível carregar os pacientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar('');
  }, [carregar]);

  return (
    <main className="mpac-main">
      <section className="mpac-content">
        <h1>Pacientes</h1>

        <div className="mpac-search">
          <input
            type="text"
            placeholder="Buscar por nome, endereço ou CRM referência"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <button type="button" onClick={() => carregar(busca)}>
            Buscar
          </button>
        </div>

        {erro && <p className="mpac-erro">{erro}</p>}

        {loading ? (
          <p>Carregando pacientes...</p>
        ) : (
          <div className="mpac-table-wrap">
            <table className="mpac-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Endereço</th>
                  <th>Altura</th>
                  <th>Peso</th>
                  <th>Médico referência</th>
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

export default BodyMedicoPacientes;
