using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.DTOs;
using GastosResidenciais.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotaisController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todas as pessoas cadastradas com seus totais de receitas,
    /// despesas e saldo, além do total geral somando todas as pessoas.
    /// Pessoas sem nenhuma transação aparecem com totais zerados.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ConsultaTotaisDto>> ObterTotais()
    {
        var pessoas = await _context.Pessoas
            .AsNoTracking()
            .Include(p => p.Transacoes)
            .OrderBy(p => p.Nome)
            .ToListAsync();

        var totaisPorPessoa = pessoas.Select(p => new TotalPessoaDto
        {
            PessoaId = p.Id,
            PessoaNome = p.Nome,
            TotalReceitas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor),
            TotalDespesas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor)
        }).ToList();

        var resultado = new ConsultaTotaisDto
        {
            Pessoas = totaisPorPessoa,
            TotalGeralReceitas = totaisPorPessoa.Sum(t => t.TotalReceitas),
            TotalGeralDespesas = totaisPorPessoa.Sum(t => t.TotalDespesas)
        };

        return Ok(resultado);
    }
}
