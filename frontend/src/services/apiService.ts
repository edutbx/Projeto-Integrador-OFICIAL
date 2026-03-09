export async function interpretarPdf(file: File): Promise<{ respostaIA?: string; erroIA?: string }> {
  const token = localStorage.getItem('jwt');
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const formData = new FormData();
  formData.append('file', file);
  // Não incluir Content-Type — o browser define o boundary do multipart automaticamente
  const res = await fetch('/api/interpretar-pdf', {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error('Erro ao processar o arquivo');
  return res.json();
}
