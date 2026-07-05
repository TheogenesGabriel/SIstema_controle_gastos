namespace GastosResidenciais.Api.Models;

/// <summary>
/// Representa uma pessoa cadastrada no sistema de controle de gastos residenciais.
/// </summary>
public class Pessoa
{
    /// <summary>
    /// Identificador único, gerado automaticamente pelo banco de dados (Guid).
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Nome da pessoa. Necessário para identificação amigável da pessoa,
    /// já que o Id é apenas um identificador técnico.
    /// </summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>
    /// Data de nascimento da pessoa. Usada para calcular a idade e aplicar
    /// a regra de negócio de que menores de 18 anos só podem ter despesas
    /// cadastradas (não podem ter receitas).
    /// </summary>
    public DateTime DataNascimento { get; set; }

    /// <summary>
    /// Transações associadas a essa pessoa. Ao excluir a pessoa, todas as
    /// transações vinculadas a ela também são excluídas (cascade delete),
    /// conforme exigido pelas regras de negócio.
    /// </summary>
    public List<Transacao> Transacoes { get; set; } = new();
}
