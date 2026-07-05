using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.Api.DTOs;

/// <summary>
/// Dados recebidos para criação de uma pessoa. O Id não é informado pelo
/// cliente: é gerado automaticamente pelo servidor.
/// </summary>
public class CriarPessoaDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
    public DateTime DataNascimento { get; set; }
}

/// <summary>
/// Representação de uma pessoa retornada pela API.
/// </summary>
public class PessoaDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }
}
