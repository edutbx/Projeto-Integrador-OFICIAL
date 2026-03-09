import { useEffect, useState } from 'react';
import { checkAuth, getUsuario, logout } from '../services/authService';

interface UseAuthResult {
  /** null = verificação em andamento | true = autenticado | false = negado */
  autenticado: boolean | null;
  usuario: { nome: string; sobrenome: string; crm: string; especializacao: string } | null;
}

/**
 * Hook de autenticação com validação no backend.
 *
 * Quando `proteger: true`:
 *  1. Verifica o token com o backend via GET /api/medico
 *  2. Se o backend retornar 401 → chama logout() → redireciona para /login
 *  3. Se retornar 200 → libera a página (autenticado = true)
 *
 * Enquanto a verificação está em andamento, `autenticado` é null.
 * Use isso nas páginas para mostrar um loading e evitar flash de conteúdo.
 */
export function useAuth(opts: { proteger?: boolean } = {}): UseAuthResult {
  const [autenticado, setAutenticado] = useState<boolean | null>(
    opts.proteger ? null : true
  );
  const usuario = getUsuario();

  useEffect(() => {
    if (!opts.proteger) return;

    let active = true;
    checkAuth().then((ok) => {
      if (!active) return;
      if (ok) {
        setAutenticado(true);
      } else {
        logout(); // limpa localStorage e vai para /login
      }
    });
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { autenticado, usuario };
}
