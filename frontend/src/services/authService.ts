import { AuthResponse } from '../types';

// Todas as chamadas usam rotas /api/** que o proxy (package.json) redireciona
// para http://localhost:5000. NUNCA chamar rotas de página como /login, /medico —
// essas pertencem ao Thymeleaf do backend e retornariam HTML, não JSON.
const API = '/api/auth';

// ─── Token (localStorage) ────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem('jwt');
}

function saveSession(data: AuthResponse): void {
  localStorage.setItem('jwt', data.token);
  localStorage.setItem('userCrm', data.crm);
  localStorage.setItem('userName', data.nome);
  localStorage.setItem('userSobrenome', data.sobrenome);
  localStorage.setItem('userEspecializacao', data.especializacao)
}

/**
 * Monta o header Authorization: Bearer <token>.
 * O JwtAuthenticationFilter do backend já aceita esse header.
 */
export function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

// ─── Login / Register ────────────────────────────────────────────────────────

export async function login(crm: string, senha: string): Promise<AuthResponse> {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crm, senha }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || 'Credenciais inválidas');
  }
  // O backend retorna { token, nome, crm } no body JSON.
  // O cookie que o backend também envia é ignorado aqui (cross-port).
  // Usamos somente o token do body, salvo no localStorage.
  const data: AuthResponse = await res.json();
  saveSession(data);
  return data;
}

export async function register(payload: {
  nome: string; sobrenome: string, cpf: string, rg: string, dataNascimento: string, sexo: string ,crm: string; especializacao: string, idGestor: string, email: string; senha: string;
  cep: string; logradouro: string; numero: string; complemento: string; cidade: string; estado: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || 'Erro ao cadastrar');
  }
  const data: AuthResponse = await res.json();
  saveSession(data);
  return data;
}

// ─── Verificação de sessão ───────────────────────────────────────────────────

/**
 * Verifica com o BACKEND se o token ainda é válido.
 * Chama GET /api/medico — rota autenticada que já existe no backend
 * (MedicoRestController). Retorna 200 se autenticado, 401 se não.
 *
 * Usamos /api/medico porque não há /api/auth/me no backend original.
 * O JwtAuthenticationFilter valida o token enviado no header Authorization.
 */
export async function checkAuth(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/medico', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok; // 200 = token válido; 401/403 = inválido ou expirado
  } catch {
    return false;
  }
}

/** Verificação rápida local (não consulta o backend) */
export function isAuthenticated(): boolean {
  return !!getToken();
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export function logout(): void {
  localStorage.removeItem('jwt');
  localStorage.removeItem('userCrm');
  localStorage.removeItem('userName');
  localStorage.removeItem('userSobrenome');
  localStorage.removeItem('userEspecializacao');
  window.location.href = '/login';
}

export function getUsuario(): { nome: string; sobrenome: string; crm: string; especializacao: string } | null {
  const nome = localStorage.getItem('userName');
  const sobrenome = localStorage.getItem('userSobrenome')
  const crm = localStorage.getItem('userCrm');
  const especializacao= localStorage.getItem('userEspecializacao')
  if (!nome || !crm) return null;
  return { nome, sobrenome, crm, especializacao };
}
