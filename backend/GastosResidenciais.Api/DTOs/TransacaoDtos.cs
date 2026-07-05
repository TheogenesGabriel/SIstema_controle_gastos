using System.ComponentModel.DataAnnotations;
using GastosResidenciais.Api.Models;

namespace GastosResidenciais.Api.DTOs;

/// <summary>
/// Dados recebidos para criação de uma transação.
/// </summary>
public class CriarTransacaoDto
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [MaxLength(300)]
    public string Descricao { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
    public decimal Valor { get; set; }

    [Required(ErrorMessage = "O tipo é obrigatório (Receita ou Despesa).")]
    public TipoTransacao Tipo { get; set; }

    [Required(ErrorMessage = "A pessoa é obrigatória.")]
    public Guid PessoaId { get; set; }
}

/// <summary>
/// Representação de uma transação retornada pela API, incluindo o nome
/// da pessoa para facilitar a exibição no front-end.
/// </summary>
public class TransacaoDto
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public Guid PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;
}
