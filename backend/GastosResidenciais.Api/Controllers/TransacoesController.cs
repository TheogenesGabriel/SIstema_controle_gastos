using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.DTOs;
using GastosResidenciais.Api.Models;
using GastosResidenciais.Api.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todas as transações. Opcionalmente filtra por pessoa via
    /// query string (?pessoaId=...), útil para telas de detalhe.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoDto>>> Listar([FromQuery] Guid? pessoaId)
    {
        var query = _context.Transacoes
            .AsNoTracking()
            .Include(t => t.Pessoa)
            .AsQueryable();

        if (pessoaId.HasValue)
            query = query.Where(t => t.PessoaId == pessoaId.Value);

        var transacoes = await query
            .OrderByDescending(t => t.Id)
            .Select(t => new TransacaoDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa!.Nome
            })
            .ToListAsync();

        return Ok(transacoes);
    }

    /// <summary>
    /// Cria uma nova transação. A pessoa informada (PessoaId) precisa
    /// existir previamente no cadastro de pessoas.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TransacaoDto>> Criar([FromBody] CriarTransacaoDto dto)
    {
        var pessoa = await _context.Pessoas.FirstOrDefaultAsync(p => p.Id == dto.PessoaId);
        if (pessoa is null)
        {
            ModelState.AddModelError(nameof(dto.PessoaId), "A pessoa informada não existe no cadastro de pessoas.");
            return ValidationProblem(ModelState);
        }

        // Regra de negócio: pessoas menores de 18 anos só podem ter
        // despesas cadastradas, nunca receitas.
        if (dto.Tipo == TipoTransacao.Receita && DataUtils.CalcularIdade(pessoa.DataNascimento) < 18)
        {
            ModelState.AddModelError(nameof(dto.Tipo), "Pessoas menores de 18 anos só podem ter despesas cadastradas, não receitas.");
            return ValidationProblem(ModelState);
        }

        var transacao = new Transacao
        {
            Id = Guid.NewGuid(),
            Descricao = dto.Descricao.Trim(),
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        var resultado = new TransacaoDto
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            PessoaId = transacao.PessoaId,
            PessoaNome = pessoa.Nome
        };

        return CreatedAtAction(nameof(Listar), new { id = transacao.Id }, resultado);
    }

    /// <summary>
    /// Remove uma transação. Funcionalidade extra (não afeta os requisitos
    /// obrigatórios), útil para corrigir lançamentos incorretos.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var transacao = await _context.Transacoes.FirstOrDefaultAsync(t => t.Id == id);

        if (transacao is null)
            return NotFound(new { mensagem = "Transação não encontrada." });

        _context.Transacoes.Remove(transacao);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
