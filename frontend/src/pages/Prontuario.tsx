import { useAuth } from '../hooks/useAuth';
import DoctorHeader from '../componets/DoctorHeader/DoctorHeader';
import BodyProntuario from '../layout/Prontuario/BodyProntuario';

export default function Prontuario() {
  const { autenticado, usuario } = useAuth({ proteger: true });
  if (autenticado === null) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontSize:'1.2rem', color:'#3b6bc8' }}>
      Verificando sessão...
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <DoctorHeader nome={usuario?.nome} crm={usuario?.crm} especializacao={usuario?.especializacao} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <BodyProntuario />
      </div>
    </div>
  );
}
