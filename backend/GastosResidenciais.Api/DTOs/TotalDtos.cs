namespace GastosResidenciais.Api.DTOs;

/// <summary>
/// Totais de receitas, despesas e saldo de uma pessoa específica.
/// </summary>
public class TotalPessoaDto
{
    public Guid PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }

    /// <summary>
    /// Saldo = Receitas - Despesas.
    /// </summary>
    public decimal Saldo => TotalReceitas - TotalDespesas;
}

/// <summary>
/// Resposta completa da consulta de totais: totais por pessoa e o total geral.
/// </summary>
public class ConsultaTotaisDto
{
    public List<TotalPessoaDto> Pessoas { get; set; } = new();
    public decimal TotalGeralReceitas { get; set; }
    public decimal TotalGeralDespesas { get; set; }
    public decimal SaldoGeral => TotalGeralReceitas - TotalGeralDespesas;
}
