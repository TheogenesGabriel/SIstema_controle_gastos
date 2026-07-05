import { useEffect, useState } from "react";
import type { ConsultaTotais } from "../types";
import { obterTotais } from "../api/client";
import { formatarMoeda } from "../utils/format";

export default function TotaisPage() {
  const [dados, setDados] = useState<ConsultaTotais | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    obterTotais()
      .then(setDados)
      .catch(() => setErro("Não foi possível carregar os totais. Verifique se a API está rodando."))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="empty-state">Carregando…</p>;
  if (erro) return <div className="error-msg">{erro}</div>;
  if (!dados) return null;

  return (
    <>
      <div className="summary-grid">
        <div className="summary-box">
          <div className="summary-label">Total geral de receitas</div>
          <div className="summary-value">{formatarMoeda(dados.totalGeralReceitas)}</div>
        </div>
        <div className="summary-box despesa">
          <div className="summary-label">Total geral de despesas</div>
          <div className="summary-value">{formatarMoeda(dados.totalGeralDespesas)}</div>
        </div>
        <div className="summary-box saldo">
          <div className="summary-label">Saldo líquido</div>
          <div className="summary-value">{formatarMoeda(dados.saldoGeral)}</div>
        </div>
      </div>

      <section className="card">
        <h2 className="card-title">Totais por pessoa</h2>
        {dados.pessoas.length === 0 ? (
          <p className="empty-state">Nenhuma pessoa cadastrada ainda.</p>
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th style={{ textAlign: "right" }}>Receitas</th>
                <th style={{ textAlign: "right" }}>Despesas</th>
                <th style={{ textAlign: "right" }}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {dados.pessoas.map((p) => (
                <tr key={p.pessoaId}>
                  <td>{p.pessoaNome}</td>
                  <td className="num">{formatarMoeda(p.totalReceitas)}</td>
                  <td className="num">{formatarMoeda(p.totalDespesas)}</td>
                  <td className="num">{formatarMoeda(p.saldo)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td>Total geral</td>
                <td className="num">{formatarMoeda(dados.totalGeralReceitas)}</td>
                <td className="num">{formatarMoeda(dados.totalGeralDespesas)}</td>
                <td className="num">{formatarMoeda(dados.saldoGeral)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
