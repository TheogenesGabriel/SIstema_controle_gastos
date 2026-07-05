namespace GastosResidenciais.Api.Models;

/// <summary>
/// Representa uma transação financeira (receita ou despesa) vinculada a uma pessoa.
/// </summary>
public class Transacao
{
    /// <summary>
    /// Identificador único, gerado automaticamente.
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Descrição da transação (ex.: "Supermercado", "Salário").
    /// </summary>
    public string Descricao { get; set; } = string.Empty;

    /// <summary>
    /// Valor monetário da transação. Sempre armazenado como valor positivo;
    /// o sinal (entrada/saída) é definido pelo campo Tipo.
    /// </summary>
    public decimal Valor { get; set; }

    /// <summary>
    /// Indica se a transação é uma Receita (entrada) ou Despesa (saída).
    /// </summary>
    public TipoTransacao Tipo { get; set; }

    /// <summary>
    /// Chave estrangeira para a pessoa dona da transação.
    /// A existência da pessoa é validada na criação da transação.
    /// </summary>
    public Guid PessoaId { get; set; }

    /// <summary>
    /// Navegação para a pessoa dona da transação.
    /// </summary>
    public Pessoa? Pessoa { get; set; }
}
