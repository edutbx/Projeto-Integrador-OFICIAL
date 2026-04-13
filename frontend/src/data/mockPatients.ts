import { Patient } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'P-10042',
    name: 'Carlos Eduardo Silva',
    age: 58,
    gender: 'Masculino',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Amendoim'],
    conditions: ['Hipertensão Arterial Sistêmica', 'Diabetes Mellitus Tipo 2', 'Dislipidemia'],
    medications: [
      'Losartana 50mg 1x/dia',
      'Metformina 850mg 2x/dia',
      'Atorvastatina 20mg 1x/dia',
      'AAS 100mg 1x/dia'
    ],
    recentVisits: [
      {
        id: 'V-8821',
        date: '2023-10-15',
        reason: 'Acompanhamento de rotina',
        notes: 'Paciente relata episódios esporádicos de tontura matinal. PA aferida no consultório: 145/90 mmHg. Glicemia capilar: 130 mg/dL. Solicitado exames laboratoriais de rotina e ajuste na dieta.',
        doctor: 'Dra. Ana Paula (Cardiologia)'
      },
      {
        id: 'V-8500',
        date: '2023-05-20',
        reason: 'Dor no peito atípica',
        notes: 'Paciente procurou PS com queixa de dor torácica em pontada, sem irradiação, que piora à palpação. ECG sem alterações isquêmicas agudas. Enzimas cardíacas normais. Diagnóstico provável de dor muscular. Orientado repouso e analgesia.',
        doctor: 'Dr. Roberto Mendes (Clínica Médica)'
      }
    ],
    labResults: [
      {
        id: 'L-991',
        date: '2023-10-18',
        test: 'Hemoglobina Glicada (HbA1c)',
        result: '7.8',
        unit: '%',
        referenceRange: '< 5.7%',
        status: 'abnormal'
      },
      {
        id: 'L-992',
        date: '2023-10-18',
        test: 'Colesterol Total',
        result: '210',
        unit: 'mg/dL',
        referenceRange: '< 190 mg/dL',
        status: 'abnormal'
      },
      {
        id: 'L-993',
        date: '2023-10-18',
        test: 'Creatinina',
        result: '1.1',
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3 mg/dL',
        status: 'normal'
      }
    ],
    notes: 'Paciente com baixa adesão à dieta prescrita. Necessita de reforço sobre a importância do controle glicêmico e pressórico.'
  },
  {
    id: 'P-10043',
    name: 'Maria Fernanda Oliveira',
    age: 34,
    gender: 'Feminino',
    bloodType: 'A-',
    allergies: ['Nenhuma conhecida'],
    conditions: ['Hipotireoidismo', 'Enxaqueca'],
    medications: [
      'Levotiroxina 75mcg 1x/dia',
      'Sumatriptano 50mg (se crise)'
    ],
    recentVisits: [
      {
        id: 'V-8901',
        date: '2023-11-02',
        reason: 'Crise de enxaqueca refratária',
        notes: 'Paciente relata aumento na frequência das crises de enxaqueca (3x/semana) associadas a náuseas e fotofobia. Uso frequente de analgésicos. Iniciado tratamento profilático com Amitriptilina 25mg/noite.',
        doctor: 'Dr. Carlos Souza (Neurologia)'
      }
    ],
    labResults: [
      {
        id: 'L-1005',
        date: '2023-08-10',
        test: 'TSH',
        result: '4.5',
        unit: 'mUI/L',
        referenceRange: '0.4 - 4.0 mUI/L',
        status: 'abnormal'
      }
    ],
    notes: 'Acompanhar resposta ao tratamento profilático para enxaqueca em 30 dias.'
  }
];