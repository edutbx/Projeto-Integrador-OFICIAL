import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User, Loader2, FileText, Activity, AlertCircle, Pill, Stethoscope, CheckCircle } from 'lucide-react';
import { interpretarPdf } from '../../services/apiService';
import { Patient, Paciente, Prontuario, ProntuarioPayload } from '../../types';
import { AIAssistant } from '../../components/AIAssistant';
import { mockPatients } from '../../data/mockPatients';
import { buscarPacienteComoMedico } from '../../services/pacienteService';
import { getUsuario } from '../../services/authService';
import { atualizarProntuario, criarProntuarioParaPacienteComoMedico, obterProntuarioPorPacienteComoMedico } from '../../services/prontuarioService';

const basePatient = mockPatients[0];

function formatarCpf(cpf: string): string {
  const d = (cpf || '').replace(/\D/g, '');
  if (d.length !== 11) return cpf || '';
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

const usuario = getUsuario();
const doctorName = usuario ? `${usuario.nome} ${usuario.sobrenome ?? ''}`.trim() : undefined;

const BodyProntuario: React.FC = () => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedData, setExtractedData] = useState<Patient | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [prontuarioSalvo, setProntuarioSalvo] = useState<Prontuario | null>(null);
  const [isLoadingProntuario, setIsLoadingProntuario] = useState(false);
  const [showModalProntuario, setShowModalProntuario] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pacienteId = params.get('pacienteId');
    if (pacienteId) {
      buscarPacienteComoMedico(pacienteId)
        .then(setPaciente)
        .catch(() => { /* dados do paciente indisponíveis; usa mock */ });
    }
  }, []);

  const activePatient = extractedData || basePatient;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setIsAnalyzing(true);
      try {
        const data = await interpretarPdf(file);
        if (data.conteudoExtraido) {
          setFileContent(data.conteudoExtraido);
        } else {
          alert(data.erroIA || 'Não foi possível extrair o texto do PDF.');
        }
      } catch {
        alert('Erro ao processar o PDF. Verifique se o servidor está disponível.');
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setFileContent(event.target?.result as string);
    reader.readAsText(file);
  };

  const handleInterpret = async () => {
    if (!fileContent.trim()) {
      alert('Por favor, insira o texto do prontuário ou faça upload de um arquivo primeiro.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
      const mergeInstruction = extractedData
        ? `ATENÇÃO: Este paciente já possui dados extraídos. Mescle as novas informações com os dados existentes abaixo. Não perca nenhuma informação anterior.\nDados Atuais: ${JSON.stringify(extractedData)}\n\nNovas informações:\n`
        : '';

      const prompt = `
Analise o seguinte texto médico e extraia as informações estruturadas em JSON.
${mergeInstruction}
Retorne APENAS um objeto JSON válido, sem marcação markdown, com esta estrutura exata:
{
  "id": "P-10042",
  "name": "Nome completo do paciente",
  "age": 0,
  "gender": "Masculino ou Feminino",
  "bloodType": "Tipo sanguíneo ou vazio",
  "allergies": ["alergia1"],
  "conditions": ["condição1"],
  "medications": ["medicamento1"],
  "labResults": [
    { "id": "L1", "test": "Nome do exame", "result": "Valor", "unit": "Unidade", "referenceRange": "Referência", "date": "YYYY-MM-DD", "status": "normal ou abnormal ou critical" }
  ],
  "recentVisits": [
    { "id": "V1", "date": "YYYY-MM-DD", "doctor": "Nome do médico", "reason": "Motivo", "notes": "Anotações da consulta" }
  ],
  "notes": "Observações clínicas gerais"
}

Texto do prontuário:
${fileContent}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr) as Patient;
      setExtractedData({ ...basePatient, ...parsed, id: parsed.id || basePatient.id });
      setFileContent('');
      setFileName('');
    } catch (err) {
      console.error(err);
      alert('Erro ao interpretar o prontuário. Verifique a chave da API e tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConsultarProntuario = async () => {
    if (!paciente) {
      alert('Paciente não identificado. Acesse o prontuário via busca por CPF.');
      return;
    }
    setIsLoadingProntuario(true);
    try {
      const dados = await obterProntuarioPorPacienteComoMedico(paciente.id);
      setProntuarioSalvo(dados);
      setShowModalProntuario(true);
    } catch {
      alert('Nenhum prontuário encontrado para este paciente.');
    } finally {
      setIsLoadingProntuario(false);
    }
  };

  const handleFecharExame = async () => {
    if (!extractedData) {
      alert('Analise um prontuário antes de encerrar o exame.');
      return;
    }
    if (!paciente) {
      alert('Paciente não identificado. Acesse o prontuário via busca por CPF.');
      return;
    }

    setIsSaving(true);
    try {
      const labText = extractedData.labResults
        .map(r => `${r.test}: ${r.result} ${r.unit} (Ref: ${r.referenceRange}) [${r.date}]`)
        .join('\n');

      const visitsText = extractedData.recentVisits
        .map(v => `[${v.date}] Dr. ${v.doctor} - ${v.reason}: ${v.notes}`)
        .join('\n');

      const payload: ProntuarioPayload = {
        resumoProblema: extractedData.conditions.length
          ? extractedData.conditions.join(', ')
          : extractedData.notes || 'Análise de prontuário via IA',
        historicoDoencaAtual: visitsText || '',
        sintomasRelatados: extractedData.conditions.join(', '),
        alergias: extractedData.allergies.join(', '),
        medicamentosEmUso: extractedData.medications.join(', '),
        hipoteseDiagnostica: '',
        condutaMedica: '',
        examesSolicitados: labText,
        observacoesGerais: extractedData.notes || '',
      };

      if (paciente.prontuarioAtualId) {
        await atualizarProntuario(paciente.prontuarioAtualId, payload);
      } else {
        await criarProntuarioParaPacienteComoMedico(paciente.id, payload);
      }

      alert('Prontuário salvo com sucesso!');
      window.location.href = '/medico';
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar prontuário. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100%' }}>

      {/* ── Barra lateral esquerda ── */}
      <aside style={{
        width: 240, flexShrink: 0, background: 'linear-gradient(180deg,#0e2a6e 0%,#1e3a8a 50%,#2458b8 100%)',
        padding: '24px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: 12,
        color: '#fff', fontFamily: 'Poppins, sans-serif'
      }}>
        <p style={{ fontSize: '0.78rem', color: '#93c5fd', fontWeight: 600, margin: 0 }}>
          Data: 10/10/2026&nbsp;&nbsp;Horário: 10:20h
        </p>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            border: '4px solid #F5A623', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <User size={56} color="#9ca3af" />
          </div>
        </div>

        {/* Dados do paciente */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {(paciente
            ? [
                ['Paciente', paciente.nome],
                ['Idade', `${paciente.idade} anos`],
                ['CPF', formatarCpf(paciente.cpf)],
                ['Endereço', paciente.endereco],
                ['Altura', `${paciente.altura} m`],
                ['Peso', `${paciente.peso} kg`],
              ]
            : [
                ['Paciente', activePatient.name],
                ['Idade', `${activePatient.age} anos`],
                ['Sexo', activePatient.gender],
                ['Histórico Médico', activePatient.conditions.join(', ')],
              ]
          ).map(([label, value]) => (
            <p key={label} style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.5 }}>
              <span style={{ color: '#F5A623', fontWeight: 700 }}>{label}: </span>
              <span style={{ whiteSpace: 'pre-line' }}>{value}</span>
            </p>
          ))}
        </div>
      </aside>

      {/* ── Painel central ── */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#f1f5f9', padding: '28px 32px' }}>

        {/* Botões de ação */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <button
            onClick={handleConsultarProntuario}
            disabled={isLoadingProntuario}
            style={btnStyle('#1E3A8A', isLoadingProntuario)}
          >
            {isLoadingProntuario
              ? <Loader2 size={15} style={{ marginRight: 6, animation: 'spin 1s linear infinite' }} />
              : null}
            CONSULTAR PRONTUÁRIOS ANTIGOS
            <span style={{ color: '#F5A623', fontSize: '1.1rem', fontWeight: 900, marginLeft: 10 }}>++</span>
          </button>

          <button
            onClick={handleInterpret}
            disabled={isAnalyzing || !fileContent.trim()}
            style={btnStyle('#1E3A8A', isAnalyzing || !fileContent.trim())}
          >
            {isAnalyzing && <Loader2 size={15} style={{ marginRight: 6, animation: 'spin 1s linear infinite' }} />}
            {extractedData ? 'ADICIONAR AO PRONTUÁRIO' : 'INTERPRETAR PRONTUÁRIO'}
            <span style={{ color: '#F5A623', fontSize: '1.1rem', fontWeight: 900, marginLeft: 10 }}>++</span>
          </button>


          {extractedData && (
            <button
              onClick={handleFecharExame}
              disabled={isSaving}
              style={btnStyle('#059669', isSaving)}
            >
              {isSaving
                ? <Loader2 size={15} style={{ marginRight: 6, animation: 'spin 1s linear infinite' }} />
                : <CheckCircle size={15} style={{ marginRight: 6 }} />}
              {isSaving ? 'SALVANDO...' : 'FECHAR EXAME'}
            </button>
          )}
        </div>

        {/* ── Estado inicial: formulário de entrada ── */}
        {!isAnalyzing && !extractedData && (
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 16px', color: '#1E3A8A', fontSize: '1rem', fontWeight: 700 }}>
              Inserir Prontuário para Análise
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <label style={{
                background: '#F5A623', color: '#fff', borderRadius: 6,
                padding: '8px 18px', fontSize: '0.85rem', fontWeight: 700,
                cursor: 'pointer', transition: 'background .2s'
              }}>
                Escolher Arquivo
                <input type="file" accept=".pdf,.txt,.md,.csv" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {fileName || 'Nenhum arquivo escolhido'}
              </span>
            </div>
            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Cole o texto do prontuário aqui para que a IA possa extrair as informações estruturadas..."
              style={{
                width: '100%', minHeight: 200, padding: 12, border: '1px solid #d1d5db',
                borderRadius: 8, fontSize: '0.875rem', resize: 'vertical',
                fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
                lineHeight: 1.6
              }}
            />
          </div>
        )}

        {/* ── Estado de carregamento ── */}
        {isAnalyzing && (
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <Loader2 size={36} color="#F5A623" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
            <p style={{ fontWeight: 700, color: '#1E3A8A', margin: '0 0 4px', fontSize: '1rem' }}>
              Processando informações...
            </p>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.82rem' }}>
              A IA está extraindo e estruturando o quadro clínico.
            </p>
          </div>
        )}

        {/* ── Campo para adicionar mais dados (após extração) ── */}
        {!isAnalyzing && extractedData && (
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 12px', color: '#1E3A8A', fontSize: '0.95rem', fontWeight: 700 }}>
              Adicionar Mais Informações (Evolução, Novos Exames)
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <label style={{
                background: '#F5A623', color: '#fff', borderRadius: 6,
                padding: '7px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer'
              }}>
                Escolher Arquivo
                <input type="file" accept=".pdf,.txt,.md,.csv" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
              <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                {fileName || 'Nenhum arquivo escolhido'}
              </span>
            </div>
            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Cole novas anotações, resultados de exames ou evolução clínica aqui..."
              style={{
                width: '100%', minHeight: 80, padding: 10, border: '1px solid #d1d5db',
                borderRadius: 8, fontSize: '0.85rem', resize: 'vertical',
                fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {/* ── Dashboard de resultados ── */}
        {extractedData && !isAnalyzing && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Perfil do paciente */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="#1E3A8A" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111' }}>{extractedData.name}</h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{extractedData.age} anos, {extractedData.gender}</p>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.7 }}>
                <p style={{ margin: 0 }}><b>ID:</b> {extractedData.id}</p>
                <p style={{ margin: 0 }}><b>Tipo Sanguíneo:</b> {extractedData.bloodType || '–'}</p>
              </div>
            </div>

            {/* Resultados laboratoriais */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}><Activity size={17} color="#10b981" style={{ marginRight: 8 }} />Resultados Laboratoriais Recentes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {extractedData.labResults.length > 0 ? extractedData.labResults.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', borderRadius: 8, padding: '10px 12px', border: '1px solid #f3f4f6' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: '#111' }}>{r.test}</p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>{r.date}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: r.status !== 'normal' ? '#dc2626' : '#059669' }}>
                        {r.result} {r.unit}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.68rem', color: '#9ca3af' }}>Ref: {r.referenceRange}</p>
                    </div>
                  </div>
                )) : <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Nenhum exame recente.</p>}
              </div>
            </div>

            {/* Condições e alergias */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}><AlertCircle size={17} color="#F5A623" style={{ marginRight: 8 }} />Condições e Alergias</h3>
              <p style={subLabel}>CONDIÇÕES CRÔNICAS</p>
              {extractedData.conditions.length > 0
                ? <ul style={{ margin: '0 0 14px', paddingLeft: 20 }}>
                    {extractedData.conditions.map((c, i) => <li key={i} style={{ fontSize: '0.85rem', color: '#374151', marginBottom: 4 }}>{c}</li>)}
                  </ul>
                : <p style={emptyText}>Nenhuma condição registrada.</p>}
              <p style={subLabel}>ALERGIAS</p>
              {extractedData.allergies.length > 0
                ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {extractedData.allergies.map((a, i) => (
                      <span key={i} style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 999, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600 }}>{a}</span>
                    ))}
                  </div>
                : <p style={emptyText}>Nenhuma alergia registrada.</p>}
            </div>

            {/* Histórico de consultas */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}><Stethoscope size={17} color="#7c3aed" style={{ marginRight: 8 }} />Histórico de Consultas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {extractedData.recentVisits.length > 0 ? extractedData.recentVisits.map((v, i) => (
                  <div key={i} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 12px', border: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <b style={{ fontSize: '0.85rem', color: '#111' }}>{v.reason}</b>
                      <time style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{v.date}</time>
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#7c3aed', fontWeight: 600 }}>{v.doctor}</p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#4b5563', lineHeight: 1.5 }}>{v.notes}</p>
                  </div>
                )) : <p style={emptyText}>Nenhum histórico encontrado.</p>}
              </div>
            </div>

            {/* Medicamentos */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}><Pill size={17} color="#4A86E8" style={{ marginRight: 8 }} />Medicamentos em Uso</h3>
              {extractedData.medications.length > 0
                ? <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {extractedData.medications.map((m, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '0.85rem', color: '#374151' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4A86E8', flexShrink: 0, marginTop: 5, marginRight: 10 }} />
                        {m}
                      </li>
                    ))}
                  </ul>
                : <p style={emptyText}>Nenhum medicamento registrado.</p>}
            </div>

            {/* Notas clínicas - largura total */}
            <div style={{ ...cardStyle, gridColumn: '1 / -1', background: '#fffbeb', border: '1px solid rgba(245,166,35,0.3)' }}>
              <h3 style={sectionTitle}><FileText size={17} color="#F5A623" style={{ marginRight: 8 }} />Notas Clínicas Gerais</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#374151', lineHeight: 1.7 }}>
                {extractedData.notes || 'Nenhuma nota adicional registrada.'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── Barra lateral direita: Copilot ── */}
      <div style={{ width: 380, flexShrink: 0, borderLeft: '1px solid #e5e7eb', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AIAssistant
          patient={activePatient}
          patientDisplayName={paciente?.nome}
          doctorName={doctorName}
        />
      </div>

      {/* ── Modal: Prontuário Armazenado ── */}
      {showModalProntuario && prontuarioSalvo && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 24
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 760,
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            fontFamily: 'Poppins, sans-serif'
          }}>
            {/* Cabeçalho do modal */}
            <div style={{
              background: 'linear-gradient(135deg,#0e2a6e,#1e3a8a)', borderRadius: '16px 16px 0 0',
              padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
              <div>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
                  Prontuário Armazenado
                </h2>
                <p style={{ margin: '4px 0 0', color: '#93c5fd', fontSize: '0.78rem' }}>
                  {prontuarioSalvo.pacienteNome}
                  {prontuarioSalvo.pacienteIdade ? ` · ${prontuarioSalvo.pacienteIdade} anos` : ''}
                </p>
                {prontuarioSalvo.atualizadoEm && (
                  <p style={{ margin: '2px 0 0', color: '#bfdbfe', fontSize: '0.72rem' }}>
                    Última atualização: {new Date(prontuarioSalvo.atualizadoEm).toLocaleString('pt-BR')}
                    {prontuarioSalvo.atualizadoPor ? ` · por ${prontuarioSalvo.atualizadoPor}` : ''}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowModalProntuario(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
                  color: '#fff', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700,
                  padding: '4px 12px', lineHeight: 1.4
                }}
              >
                ✕
              </button>
            </div>

            {/* Conteúdo dos campos clínicos */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Resumo do Problema', value: prontuarioSalvo.resumoProblema },
                { label: 'Histórico da Doença Atual', value: prontuarioSalvo.historicoDoencaAtual },
                { label: 'Sintomas Relatados', value: prontuarioSalvo.sintomasRelatados },
                { label: 'Alergias', value: prontuarioSalvo.alergias },
                { label: 'Medicamentos em Uso', value: prontuarioSalvo.medicamentosEmUso },
                { label: 'Hipótese Diagnóstica', value: prontuarioSalvo.hipoteseDiagnostica },
                { label: 'Conduta Médica', value: prontuarioSalvo.condutaMedica },
                { label: 'Exames Solicitados', value: prontuarioSalvo.examesSolicitados },
                { label: 'Observações Gerais', value: prontuarioSalvo.observacoesGerais },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{
                    margin: '0 0 4px', fontSize: '0.7rem', fontWeight: 700,
                    color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em'
                  }}>
                    {label}
                  </p>
                  <p style={{
                    margin: 0, fontSize: '0.875rem', color: value ? '#111827' : '#9ca3af',
                    background: '#f9fafb', borderRadius: 8, padding: '10px 14px',
                    border: '1px solid #e5e7eb', lineHeight: 1.6, whiteSpace: 'pre-wrap'
                  }}>
                    {value || 'Não informado'}
                  </p>
                </div>
              ))}

              {prontuarioSalvo.interpretacaoIa && (
                <div>
                  <p style={{
                    margin: '0 0 4px', fontSize: '0.7rem', fontWeight: 700,
                    color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.07em'
                  }}>
                    Interpretação da IA
                  </p>
                  <p style={{
                    margin: 0, fontSize: '0.875rem', color: '#1e1b4b',
                    background: '#eef2ff', borderRadius: 8, padding: '10px 14px',
                    border: '1px solid #c7d2fe', lineHeight: 1.6, whiteSpace: 'pre-wrap'
                  }}>
                    {prontuarioSalvo.interpretacaoIa}
                  </p>
                </div>
              )}
            </div>

            {/* Rodapé do modal */}
            <div style={{
              padding: '16px 28px', borderTop: '1px solid #e5e7eb',
              display: 'flex', justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowModalProntuario(false)}
                style={btnStyle('#1E3A8A')}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe para o spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

/* ── Estilos reutilizáveis ── */
const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 12, padding: '20px',
  border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
};

const sectionTitle: React.CSSProperties = {
  margin: '0 0 14px', fontSize: '0.92rem', fontWeight: 700, color: '#111',
  display: 'flex', alignItems: 'center'
};

const subLabel: React.CSSProperties = {
  margin: '0 0 6px', fontSize: '0.7rem', fontWeight: 700,
  color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em'
};

const emptyText: React.CSSProperties = {
  margin: '0 0 10px', fontSize: '0.82rem', color: '#9ca3af'
};

function btnStyle(bg: string, disabled = false): React.CSSProperties {
  return {
    background: disabled ? '#9ca3af' : bg,
    color: '#fff', border: 'none', borderRadius: 6,
    padding: '10px 18px', fontSize: '0.83rem', fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center',
    opacity: disabled ? 0.7 : 1,
    transition: 'background .2s, opacity .2s',
    whiteSpace: 'nowrap'
  };
}

export default BodyProntuario;
