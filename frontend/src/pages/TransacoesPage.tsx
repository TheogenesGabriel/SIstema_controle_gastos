import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { Pessoa, Transacao } from "../types";
import { TipoTransacao } from "../types";
import {
  criarTransacao,
  deletarTransacao,
  listarPessoas,
  listarTransacoes,
} from "../api/client";
import { calcularIdade, formatarMoeda } from "../utils/format";

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa);
  const [pessoaId, setPessoaId] = useState("");

  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === pessoaId) ?? null,
    [pessoas, pessoaId]
  );

  const pessoaSelecionadaMenorDeIdade = pessoaSelecionada
    ? calcularIdade(pessoaSelecionada.dataNascimento) < 18
    : false;

  async function carregar() {
    setCarregando(true);
    try {
      const [t, p] = await Promise.all([listarTransacoes(), listarPessoas()]);
      setTransacoes(t);
      setPessoas(p);
      if (p.length > 0 && !pessoaId) setPessoaId(p[0].id);
    } catch {
      setErro("Não foi possível carregar os dados. Verifique se a API está rodando.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Se a pessoa selecionada for menor de idade e "Receita" estiver marcado,
  // força de volta para "Despesa" automaticamente (regra de negócio).
  useEffect(() => {
    if (pessoaSelecionadaMenorDeIdade && tipo === TipoTransacao.Receita) {
      setTipo(TipoTransacao.Despesa);
    }
  }, [pessoaSelecionadaMenorDeIdade, tipo]);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao.trim() || !valor || !pessoaId) return;

    setSalvando(true);
    setErro(null);
    try {
      await criarTransacao({
        descricao: descricao.trim(),
        valor: parseFloat(valor),
        tipo,
        pessoaId,
      });
      setDescricao("");
      setValor("");
      const t = await listarTransacoes();
      setTransacoes(t);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const mensagens = Object.values(err.response.data.errors).flat().join(" ");
        setErro(mensagens || "Não foi possível cadastrar a transação.");
      } else {
        setErro("Não foi possível cadastrar a transação. Confira se a pessoa selecionada existe.");
      }
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id: string) {
    try {
      await deletarTransacao(id);
      setTransacoes((atual) => atual.filter((t) => t.id !== id));
    } catch {
      setErro("Não foi possível excluir a transação.");
    }
  }

  const semPessoas = !carregando && pessoas.length === 0;

  return (
    <>
      <section className="card">
        <h2 className="card-title">
          <span className="eyebrow">Novo registro</span> Lançar transação
        </h2>

        {semPessoas ? (
          <p className="empty-state">
            Cadastre uma pessoa na aba <strong>Pessoas</strong> antes de lançar transações.
          </p>
        ) : (
          <form onSubmit={handleCriar}>
            <div className="form-row">
              <div className="field" style={{ flex: 2 }}>
                <label htmlFor="descricao">Descrição</label>
                <input
                  id="descricao"
                  type="text"
                  placeholder="Ex.: Supermercado"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="valor">Valor (R$)</label>
                <input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="tipo">Tipo</label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(Number(e.target.value) as TipoTransacao)}
                >
                  <option value={TipoTransacao.Despesa}>Despesa</option>
                  <option value={TipoTransacao.Receita} disabled={pessoaSelecionadaMenorDeIdade}>
                    Receita{pessoaSelecionadaMenorDeIdade ? " (bloqueado — menor de idade)" : ""}
                  </option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="pessoa">Pessoa</label>
                <select id="pessoa" value={pessoaId} onChange={(e) => setPessoaId(e.target.value)}>
                  {pessoas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn" type="submit" disabled={salvando}>
                {salvando ? "Salvando…" : "Lançar"}
              </button>
            </div>
            {pessoaSelecionadaMenorDeIdade && (
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  color: "var(--color-despesa)",
                  marginTop: "0.6rem",
                }}
              >
                {pessoaSelecionada?.nome} é menor de idade — apenas despesas podem ser cadastradas.
              </p>
            )}
          </form>
        )}
        {erro && <div className="error-msg">{erro}</div>}
      </section>

      <section className="card">
        <h2 className="card-title">Transações lançadas</h2>
        {carregando ? (
          <p className="empty-state">Carregando…</p>
        ) : transacoes.length === 0 ? (
          <p className="empty-state">Nenhuma transação lançada ainda.</p>
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Pessoa</th>
                <th>Tipo</th>
                <th style={{ textAlign: "right" }}>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t) => (
                <tr key={t.id}>
                  <td>{t.descricao}</td>
                  <td>{t.pessoaNome}</td>
                  <td>
                    <span
                      className={`tag ${
                        t.tipo === TipoTransacao.Receita ? "tag-receita" : "tag-despesa"
                      }`}
                    >
                      {t.tipo === TipoTransacao.Receita ? "Receita" : "Despesa"}
                    </span>
                  </td>
                  <td className="num">{formatarMoeda(t.valor)}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="icon-btn" onClick={() => handleDeletar(t.id)}>
                      excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
