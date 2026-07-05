using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.DTOs;
using GastosResidenciais.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoasController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todas as pessoas cadastradas.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PessoaDto>>> Listar()
    {
        var pessoas = await _context.Pessoas
            .AsNoTracking()
            .OrderBy(p => p.Nome)
            .Select(p => new PessoaDto { Id = p.Id, Nome = p.Nome, DataNascimento = p.DataNascimento })
            .ToListAsync();

        return Ok(pessoas);
    }

    /// <summary>
    /// Retorna uma pessoa específica pelo Id.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PessoaDto>> ObterPorId(Guid id)
    {
        var pessoa = await _context.Pessoas.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pessoa is null)
            return NotFound(new { mensagem = "Pessoa não encontrada." });

        return Ok(new PessoaDto { Id = pessoa.Id, Nome = pessoa.Nome, DataNascimento = pessoa.DataNascimento });
    }

    /// <summary>
    /// Cria uma nova pessoa. O Id é gerado automaticamente pelo servidor.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PessoaDto>> Criar([FromBody] CriarPessoaDto dto)
    {
        var pessoa = new Pessoa
        {
            Id = Guid.NewGuid(),
            Nome = dto.Nome.Trim(),
            DataNascimento = dto.DataNascimento
        };

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        var resultado = new PessoaDto { Id = pessoa.Id, Nome = pessoa.Nome, DataNascimento = pessoa.DataNascimento };
        return CreatedAtAction(nameof(ObterPorId), new { id = pessoa.Id }, resultado);
    }

    /// <summary>
    /// Remove uma pessoa. Todas as transações vinculadas a ela são removidas
    /// automaticamente em cascata (configurado no AppDbContext).
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var pessoa = await _context.Pessoas.FirstOrDefaultAsync(p => p.Id == id);

        if (pessoa is null)
            return NotFound(new { mensagem = "Pessoa não encontrada." });

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
