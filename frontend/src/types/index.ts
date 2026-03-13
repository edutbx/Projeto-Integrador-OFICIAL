export interface AuthResponse {
  token: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  sexo: string;
  crm: string;
  especializacao: string;
  idGestor: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
}

export interface LoginRequest {
  crm: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  sobrenome?: string;
  crm: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  sexo: string;
  especializacao?: string;
  idGestor: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  senha: string;
}

export interface Consulta {
  id: number;
  paciente: string;
  horario: string;
  informacoes: string;
  foto?: string;
}

export interface GestorLoginRequest {
  email: string;
  senha: string;
}

export interface MedicoResumo {
  id: string;
  nome: string;
  sobrenome: string;
  crm: string;
  especializacao: string;
  email: string;
}

export interface MedicosResponse {
  totalMedicosAtivos: number;
  medicos: MedicoResumo[];
}
