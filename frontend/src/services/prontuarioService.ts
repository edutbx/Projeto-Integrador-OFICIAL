import { getGestorToken, getToken } from './authService';
import { Prontuario, ProntuarioPayload } from '../types';

const API = '/api/prontuarios';

function authHeaders(token: string | null): HeadersInit {
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

async function parseResponse<T>(res: Response, defaultError: string): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.erroIA || defaultError);
  }
  return res.json();
}

export async function obterProntuarioPorPacienteComoGestor(pacienteId: string): Promise<Prontuario> {
  const token = getGestorToken();
  const res = await fetch(`${API}/paciente/${pacienteId}`, {
    headers: authHeaders(token),
  });
  return parseResponse<Prontuario>(res, 'Prontuário não encontrado');
}

export async function obterProntuarioPorPacienteComoMedico(pacienteId: string): Promise<Prontuario> {
  const token = getToken();
  const res = await fetch(`${API}/paciente/${pacienteId}`, {
    headers: authHeaders(token),
  });
  return parseResponse<Prontuario>(res, 'Prontuário não encontrado');
}

export async function criarProntuarioParaPaciente(pacienteId: string, payload: ProntuarioPayload): Promise<Prontuario> {
  const token = getGestorToken();
  const res = await fetch(`${API}/paciente/${pacienteId}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return parseResponse<Prontuario>(res, 'Erro ao criar prontuário');
}

export async function criarProntuarioParaPacienteComoMedico(pacienteId: string, payload: ProntuarioPayload): Promise<Prontuario> {
  const token = getToken();
  const res = await fetch(`${API}/paciente/${pacienteId}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return parseResponse<Prontuario>(res, 'Erro ao criar prontuário');
}

export async function atualizarProntuario(id: string, payload: ProntuarioPayload): Promise<Prontuario> {
  const token = getToken() || getGestorToken();
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return parseResponse<Prontuario>(res, 'Erro ao atualizar prontuário');
}

export async function interpretarProntuarioIa(id: string): Promise<string> {
  const token = getToken() || getGestorToken();
  const res = await fetch(`${API}/${id}/interpretar-ia`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  const data = await parseResponse<{ respostaIA: string }>(res, 'Erro ao interpretar prontuário com IA');
  return data.respostaIA;
}
