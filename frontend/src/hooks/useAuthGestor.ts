import { useEffect, useState } from 'react';
import { checkAuthGestor, getGestor, logoutGestor } from '../services/authService';

interface UseAuthGestorResult {
  /** null = verificação em andamento | true = autenticado | false = negado */
  autenticado: boolean | null;
  gestor: { nome: string; sobrenome: string; email: string } | null;
}

/**
 * Hook de autenticação para a área do gestor.
 * Valida o token via GET /api/admin/medicos (exige ROLE_ADMIN).
 * Se inválido → chama logoutGestor() → redireciona para /login-gestor.
 */
export function useAuthGestor(opts: { proteger?: boolean } = {}): UseAuthGestorResult {
  const [autenticado, setAutenticado] = useState<boolean | null>(
    opts.proteger ? null : true
  );
  const gestor = getGestor();

  useEffect(() => {
    if (!opts.proteger) return;

    let active = true;
    checkAuthGestor().then((ok) => {
      if (!active) return;
      if (ok) {
        setAutenticado(true);
      } else {
        logoutGestor();
      }
    });
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { autenticado, gestor };
}
