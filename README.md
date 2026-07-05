# Livro-Caixa — Controle de Gastos Residenciais

Sistema de controle de gastos residenciais com cadastro de pessoas,
cadastro de transações (receitas/despesas) e consulta de totais.

- **Back-end:** .NET 8 (ASP.NET Core Web API) + Entity Framework Core + SQLite
- **Front-end:** React + TypeScript (Vite)

## Estrutura

```
gastos-residenciais/
├── backend/
│   └── GastosResidenciais.Api/    # API .NET
└── frontend/                       # SPA React + TypeScript
```

## Como rodar

### 1. Back-end (API)

Pré-requisito: [.NET 8 SDK](https://dotnet.microsoft.com/download).

```bash
cd backend/GastosResidenciais.Api
dotnet restore
dotnet run
```

A API sobe em `http://localhost:5199` (definido em `Properties/launchSettings.json`).
O Swagger fica disponível em `http://localhost:5199/swagger`.

O banco de dados SQLite (`gastos.db`) é criado automaticamente na primeira
execução, na pasta do projeto, e os dados persistem entre execuções.

### 2. Front-end (React)

Pré-requisito: Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Certifique-se de que a API
esteja rodando em `http://localhost:5199` (URL configurada em
`frontend/src/api/client.ts`) — o CORS do back-end já está liberado para
essa origem.

## Funcionalidades implementadas

- **Cadastro de pessoas:** criação, listagem e exclusão. Ao excluir uma
  pessoa, todas as transações vinculadas a ela são excluídas
  automaticamente (cascade delete, configurado no `AppDbContext`).
- **Cadastro de transações:** descrição, valor, tipo (receita/despesa) e
  pessoa vinculada. A API valida que a pessoa informada existe antes de
  aceitar a transação. Exclusão de transações foi adicionada como recurso
  extra, sem afetar os requisitos originais.
- **Consulta de totais:** lista todas as pessoas com total de receitas,
  despesas e saldo (receita − despesa) de cada uma, além do total geral
  (somando todas as pessoas) ao final.
- **Regra de menor de idade:** pessoas com menos de 18 anos (calculado a
  partir da `DataNascimento`) só podem ter **despesas** cadastradas —
  tentativas de cadastrar uma receita para um menor são rejeitadas pela
  API com erro de validação (400), e a opção "Receita" já vem desabilitada
  no formulário do front-end quando a pessoa selecionada é menor de idade.

## Decisões de projeto

- **Identificadores:** `Guid` gerado automaticamente pelo servidor (nunca
  informado pelo cliente), tanto para pessoas quanto para transações.
- **Persistência:** SQLite via EF Core — arquivo local, sem necessidade de
  servidor de banco de dados externo, e os dados sobrevivem ao fechar a
  aplicação.
- **Nome e data de nascimento da pessoa:** o enunciado corta o texto logo
  após o campo "Identificador" no cadastro de pessoa. Foram adicionados os
  campos **Nome** (indispensável para identificar a pessoa na interface) e
  **Data de nascimento** (necessária para a regra de menor de idade).
- **Validação de pessoa em transações:** a API rejeita a criação de uma
  transação cujo `pessoaId` não exista no cadastro de pessoas, retornando
  um erro de validação (400).
- **Cálculo de idade:** feito com base em anos completos (considera se o
  aniversário do ano já ocorreu), implementado tanto no back-end
  (`Utils/DataUtils.cs`) quanto replicado no front-end
  (`src/utils/format.ts`) para dar feedback imediato antes de chamar a API.

## Atenção ao rodar após esta atualização

Como o projeto usa `Database.EnsureCreated()` (sem migrations do EF Core),
o schema do banco só é criado automaticamente na **primeira** execução. Se
você já tinha rodado uma versão anterior do projeto (sem o campo
`DataNascimento`), apague o arquivo `gastos.db` (e os arquivos
`gastos.db-shm` / `gastos.db-wal`, se existirem) dentro de
`backend/GastosResidenciais.Api/` antes de rodar `dotnet run` novamente,
para que a tabela `Pessoas` seja recriada com a nova coluna. Isso apaga os
dados cadastrados até então.
