import axios from "axios";
import type {
  ConsultaTotais,
  Pessoa,
  Transacao,
  TipoTransacao,
} from "../types";

// URL base da API .NET. Ajuste caso o back-end rode em outra porta
// (veja backend/GastosResidenciais.Api/Properties/launchSettings.json).
const BASE_URL = "http://localhost:5199/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---- Pessoas ----

export async function listarPessoas(): Promise<Pessoa[]> {
  const { data } = await api.get<Pessoa[]>("/pessoas");
  return data;
}

export async function criarPessoa(nome: string, dataNascimento: string): Promise<Pessoa> {
  const { data } = await api.post<Pessoa>("/pessoas", { nome, dataNascimento });
  return data;
}

export async function deletarPessoa(id: string): Promise<void> {
  await api.delete(`/pessoas/${id}`);
}

// ---- Transações ----

export async function listarTransacoes(pessoaId?: string): Promise<Transacao[]> {
  const { data } = await api.get<Transacao[]>("/transacoes", {
    params: pessoaId ? { pessoaId } : undefined,
  });
  return data;
}

export interface NovaTransacao {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

export async function criarTransacao(dto: NovaTransacao): Promise<Transacao> {
  const { data } = await api.post<Transacao>("/transacoes", dto);
  return data;
}

export async function deletarTransacao(id: string): Promise<void> {
  await api.delete(`/transacoes/${id}`);
}

// ---- Totais ----

export async function obterTotais(): Promise<ConsultaTotais> {
  const { data } = await api.get<ConsultaTotais>("/totais");
  return data;
}
