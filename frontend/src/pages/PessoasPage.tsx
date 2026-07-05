import { useEffect, useState } from "react";
import type { Pessoa } from "../types";
import { criarPessoa, deletarPessoa, listarPessoas } from "../api/client";
import { calcularIdade } from "../utils/format";

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setCarregando(true);
    try {
      const dados = await listarPessoas();
      setPessoas(dados);
    } catch {
      setErro("Não foi possível carregar as pessoas. Verifique se a API está rodando.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !dataNascimento) return;

    setSalvando(true);
    setErro(null);
    try {
      await criarPessoa(nome.trim(), dataNascimento);
      setNome("");
      setDataNascimento("");
      await carregar();
    } catch {
      setErro("Não foi possível cadastrar a pessoa.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id: string) {
    const confirmar = window.confirm(
      "Excluir esta pessoa também excluirá todas as transações vinculadas a ela. Deseja continuar?"
    );
    if (!confirmar) return;

    try {
      await deletarPessoa(id);
      setPessoas((atual) => atual.filter((p) => p.id !== id));
    } catch {
      setErro("Não foi possível excluir a pessoa.");
    }
  }

  return (
    <>
      <section className="card">
        <h2 className="card-title">
          <span className="eyebrow">Novo registro</span> Cadastrar pessoa
        </h2>
        <form className="form-row" onSubmit={handleCriar}>
          <div className="field" style={{ flex: 2 }}>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Ex.: Maria Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="dataNascimento">Data de nascimento</label>
            <input
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </div>
          <button className="btn" type="submit" disabled={salvando}>
            {salvando ? "Salvando…" : "Adicionar pessoa"}
          </button>
        </form>
        {erro && <div className="error-msg">{erro}</div>}
      </section>

      <section className="card">
        <h2 className="card-title">Pessoas cadastradas</h2>
        {carregando ? (
          <p className="empty-state">Carregando…</p>
        ) : pessoas.length === 0 ? (
          <p className="empty-state">Nenhuma pessoa cadastrada ainda.</p>
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th>Identificador</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((p) => {
                const idade = calcularIdade(p.dataNascimento);
                const menorDeIdade = idade < 18;
                return (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>
                      {idade} anos
                      {menorDeIdade && (
                        <span className="tag tag-despesa" style={{ marginLeft: "0.5rem" }}>
                          menor de idade
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78rem",
                        color: "var(--color-ink-soft)",
                      }}
                    >
                      {p.id}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="icon-btn" onClick={() => handleDeletar(p.id)}>
                        excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
