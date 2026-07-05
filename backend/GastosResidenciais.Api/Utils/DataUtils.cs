namespace GastosResidenciais.Api.Utils;

/// <summary>
/// Funções utilitárias relacionadas a datas.
/// </summary>
public static class DataUtils
{
    /// <summary>
    /// Calcula a idade em anos completos a partir da data de nascimento,
    /// considerando corretamente se o aniversário do ano corrente já
    /// ocorreu ou não (não é apenas a subtração dos anos).
    /// </summary>
    public static int CalcularIdade(DateTime dataNascimento)
    {
        var hoje = DateTime.Today;
        var idade = hoje.Year - dataNascimento.Year;

        if (dataNascimento.Date > hoje.AddYears(-idade))
            idade--;

        return idade;
    }
}
