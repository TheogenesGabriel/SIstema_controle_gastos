using GastosResidenciais.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Pessoa>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Nome)
                .IsRequired()
                .HasMaxLength(200);
        });

        modelBuilder.Entity<Transacao>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Descricao)
                .IsRequired()
                .HasMaxLength(300);
            entity.Property(t => t.Valor)
                .HasColumnType("decimal(18,2)");

            // Regra de negócio: ao deletar uma pessoa, todas as suas
            // transações devem ser removidas automaticamente (cascade).
            entity.HasOne(t => t.Pessoa)
                .WithMany(p => p.Transacoes)
                .HasForeignKey(t => t.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
