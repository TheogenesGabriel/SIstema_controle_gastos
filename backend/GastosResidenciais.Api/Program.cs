using GastosResidenciais.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

//Serviços

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Banco de dados SQLite: o arquivo gastos.db é criado na pasta da aplicação
// e os dados persistem entre execuções (fechar/abrir a aplicação).
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS liberado para o front-end React rodando localmente (Vite: 5173, CRA: 3000).
const string CorsPolicy = "FrontEndPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Garante que o banco de dados e as tabelas existam ao iniciar a aplicação.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Middleware pipeline

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicy);
app.UseAuthorization();
app.MapControllers();

app.Run();
