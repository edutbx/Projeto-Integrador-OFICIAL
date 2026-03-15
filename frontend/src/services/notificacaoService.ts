export interface Notificacao {
  id: string;
  tipo: string;
  nomeRemetente: string;
  emailRemetente: string;
  crm: string;
  mensagem: string;
  dataHora: string;
  lida: boolean;
}

export async function enviarSolicitacao(dados: {
  nomeRemetente: string;
  emailRemetente: string;
  crm?: string;
  mensagem?: string;
}): Promise<void> {
  const res = await fetch('/api/notificacoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao enviar solicitação');
}

export async function listarNotificacoes(token: string): Promise<Notificacao[]> {
  const res = await fetch('/api/notificacoes/admin', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao buscar notificações');
  return res.json();
}

export async function contarNaoLidas(token: string): Promise<number> {
  const res = await fetch('/api/notificacoes/admin/count', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.naoLidas;
}

export async function marcarComoLida(id: string, token: string): Promise<void> {
  await fetch(`/api/notificacoes/admin/${id}/lida`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
}
