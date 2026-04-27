import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Patient } from '../types';
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import Markdown from 'react-markdown';

interface AIAssistantProps {
  patient: Patient;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant({ patient }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá, Doutor(a). Sou o assistente de IA do Saúde ++. Estou analisando o prontuário de **${patient.name}**. Como posso ajudar na sua decisão clínica hoje?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: `Olá, Doutor(a). Mudei para o prontuário de **${patient.name}**. Como posso ajudar?`
    }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.id]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

      const systemInstruction = `Você é um assistente médico de IA altamente qualificado integrado à plataforma "Saúde ++".
Seu objetivo é auxiliar médicos na análise de prontuários, sugerir hipóteses diagnósticas, alertar sobre interações medicamentosas e resumir históricos clínicos.
Seja profissional, conciso, baseado em evidências e focado na segurança do paciente.
Sempre lembre o médico que suas sugestões não substituem o julgamento clínico humano.

Dados do paciente atual:
Nome: ${patient.name}
Idade: ${patient.age} | Sexo: ${patient.gender} | Tipo Sanguíneo: ${patient.bloodType}
Alergias: ${patient.allergies.join(', ')}
Condições: ${patient.conditions.join(', ')}
Medicamentos: ${patient.medications.join(', ')}
Exames: ${JSON.stringify(patient.labResults)}
Consultas: ${JSON.stringify(patient.recentVisits)}
Notas: ${patient.notes}

Responda com base EXCLUSIVAMENTE nesses dados e no conhecimento médico geral. Use Markdown para formatar.`;

      const history = messages.map(m => `${m.role === 'user' ? 'Médico' : 'Assistente'}: ${m.content}`).join('\n');
      const prompt = `${history}\n\nMédico: ${userMessage.content}\nAssistente:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction, temperature: 0.2 }
      });

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || 'Desculpe, não consegui gerar uma resposta.'
      }]);
    } catch (error) {
      console.error('Gemini error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Ocorreu um erro ao processar sua solicitação. Verifique a chave da API.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const quickPrompts = [
    'Resuma o histórico clínico',
    'Há interações medicamentosas?',
    'Analise os últimos exames',
    'Sugira conduta para a próxima consulta',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Poppins, sans-serif' }}>

      {/* Cabeçalho */}
      <div style={{
        background: '#eef2ff', borderBottom: '1px solid #e0e7ff',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Sparkles size={20} color="#4f46e5" />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Saúde ++ Copilot</p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#4f46e5', fontWeight: 600 }}>Assistente Clínico IA</p>
        </div>
      </div>

      {/* Área de mensagens */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Aviso legal */}
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8,
          padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start'
        }}>
          <AlertTriangle size={14} color="#92400e" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#78350f', lineHeight: 1.5 }}>
            As sugestões da IA são apenas para suporte à decisão clínica e não substituem o julgamento profissional do médico.
          </p>
        </div>

        {/* Mensagens */}
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ display: 'flex', maxWidth: '88%', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 8 }}>

              {/* Avatar */}
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user' ? '#f3f4f6' : '#e0e7ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {msg.role === 'user'
                  ? <User size={14} color="#6b7280" />
                  : <Bot size={14} color="#4f46e5" />}
              </div>

              {/* Bolha */}
              <div style={{
                padding: '10px 14px', borderRadius: 16, fontSize: '0.82rem', lineHeight: 1.6,
                ...(msg.role === 'user'
                  ? { background: '#111827', color: '#fff', borderTopRightRadius: 4 }
                  : { background: '#f3f4f6', color: '#1f2937', borderTopLeftRadius: 4 })
              }}>
                {msg.role === 'user'
                  ? <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                  : (
                    <div style={{ fontSize: '0.82rem' }}>
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading */}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', background: '#e0e7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Bot size={14} color="#4f46e5" />
            </div>
            <div style={{
              background: '#f3f4f6', borderRadius: 16, borderTopLeftRadius: 4,
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Loader2 size={14} color="#4f46e5" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Analisando prontuário...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Rodapé: prompts rápidos + input */}
      <div style={{ borderTop: '1px solid #e5e7eb', padding: '12px 16px', flexShrink: 0 }}>

        {/* Prompts rápidos */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setInput(prompt)}
              style={{
                border: '1px solid #e5e7eb', background: '#fff',
                borderRadius: 999, padding: '4px 12px',
                fontSize: '0.72rem', fontWeight: 500, color: '#4b5563',
                cursor: 'pointer', transition: 'all .15s',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4f46e5'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#a5b4fc'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4b5563'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Campo de texto */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          border: '1px solid #d1d5db', borderRadius: 12, background: '#fff',
          padding: '4px 4px 4px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Faça uma pergunta sobre o paciente..."
            rows={1}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              resize: 'none', fontSize: '0.82rem', color: '#111827',
              fontFamily: 'inherit', padding: '8px 0', lineHeight: 1.5,
              maxHeight: 120, overflowY: 'auto'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              width: 36, height: 36, borderRadius: 8, border: 'none',
              background: !input.trim() || isLoading ? '#d1d5db' : '#4f46e5',
              color: '#fff', cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background .2s'
            }}
          >
            <Send size={15} />
          </button>
        </div>

        <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: '0.65rem', color: '#9ca3af' }}>
          A IA pode cometer erros. Verifique informações importantes.
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
