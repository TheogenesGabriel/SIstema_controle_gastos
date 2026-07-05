// Usamos um objeto const em vez de `enum` (o template TS do Vite roda com
// erasableSyntaxOnly, que não permite enums reais), mas o uso no resto do
// código (TipoTransacao.Receita, comparações, etc.) permanece o mesmo.
export const TipoTransacao = {
  Receita: 0,
  Despesa: 1,
} as const;

export type TipoTransacao = (typeof TipoTransacao)[keyof typeof TipoTransacao];

export interface Pessoa {
  id: string;
  nome: string;
  dataNascimento: string; // formato ISO (yyyy-MM-dd), como retornado pela API
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
  pessoaNome: string;
}

export interface TotalPessoa {
  pessoaId: string;
  pessoaNome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface ConsultaTotais {
  pessoas: TotalPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoGeral: number;
}
