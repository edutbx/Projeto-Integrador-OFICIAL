import { getGestorToken, getToken } from './authService';
import { Paciente, PacientePayload, PacientesResponse } from '../types';

const API = '/api/pacientes';

async function processarResposta<T>(res: Response, erroPadrao: string): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.erro || data.error || data.message || erroPadrao);
  }
  return res.json();
}

function cabecalhosComToken(token: string | null): HeadersInit {
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export async function listarPacientesComoGestor(busca = ''): Promise<PacientesResponse> {
  const token = getGestorToken();
  const query = busca.trim() ? `?q=${encodeURIComponent(busca.trim())}` : '';
  const res = await fetch(`${API}${query}`, {
    headers: cabecalhosComToken(token),
  });
  return processarResposta<PacientesResponse>(res, 'Erro ao listar pacientes');
}

export async function listarPacientesComoMedico(busca = ''): Promise<PacientesResponse> {
  const token = getToken();
  const query = busca.trim() ? `?q=${encodeURIComponent(busca.trim())}` : '';
  const res = await fetch(`${API}${query}`, {
    headers: cabecalhosComToken(token),
  });
  return processarResposta<PacientesResponse>(res, 'Erro ao listar pacientes');
}

export async function buscarPacienteComoGestor(id: string): Promise<Paciente> {
  const token = getGestorToken();
  const res = await fetch(`${API}/${id}`, {
    headers: cabecalhosComToken(token),
  });
  return processarResposta<Paciente>(res, 'Erro ao buscar paciente');
}

export async function buscarPacienteComoMedico(id: string): Promise<Paciente> {
  const token = getToken();
  const res = await fetch(`${API}/${id}`, {
    headers: cabecalhosComToken(token),
  });
  return processarResposta<Paciente>(res, 'Erro ao buscar paciente');
}

export async function buscarPacientePorCpfComoMedico(cpf: string): Promise<Paciente> {
  const token = getToken();
  const cpfDigits = cpf.replace(/\D/g, '');
  const res = await fetch(`${API}/por-cpf/${cpfDigits}`, {
    headers: cabecalhosComToken(token),
  });
  return processarResposta<Paciente>(res, 'Paciente não cadastrado');
}

export async function criarPaciente(payload: PacientePayload): Promise<Paciente> {
  const token = getGestorToken();
  const res = await fetch(API, {
    method: 'POST',
    headers: cabecalhosComToken(token),
    body: JSON.stringify(payload),
  });
  return processarResposta<Paciente>(res, 'Erro ao cadastrar paciente');
}

export async function atualizarPaciente(id: string, payload: PacientePayload): Promise<Paciente> {
  const token = getGestorToken();
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: cabecalhosComToken(token),
    body: JSON.stringify(payload),
  });
  return processarResposta<Paciente>(res, 'Erro ao atualizar paciente');
}

export async function deletarPaciente(id: string): Promise<void> {
  const token = getGestorToken();
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: cabecalhosComToken(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.erro || data.error || data.message || 'Erro ao remover paciente');
  }
}
