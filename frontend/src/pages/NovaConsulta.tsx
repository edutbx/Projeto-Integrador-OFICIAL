import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DoctorHeader from '../componets/DoctorHeader/DoctorHeader';
import BodyNovaConsulta from '../layout/NovaConsulta/BodyNovaConsulta';

export default function NovaConsulta() {
  const { autenticado, usuario } = useAuth({ proteger: true });
  if (autenticado === null) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontSize:'1.2rem', color:'#3b6bc8' }}>
      Verificando sessão...
    </div>
  );
  return (
    <div className="nc-page">
      <DoctorHeader nome={usuario?.nome} sobrenome={usuario?.sobrenome} crm={usuario?.crm} especializacao={usuario?.especializacao} />
      <BodyNovaConsulta />
    </div>
  );
}
