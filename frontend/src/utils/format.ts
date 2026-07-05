export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Calcula a idade em anos completos a partir da data de nascimento,
 * considerando corretamente se o aniversário do ano corrente já ocorreu.
 * Mesma lógica usada no back-end (Utils/DataUtils.cs), para dar feedback
 * imediato no formulário antes mesmo de chamar a API.
 */
export function calcularIdade(dataNascimentoISO: string): number {
  const nascimento = new Date(dataNascimentoISO);
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aniversarioJaOcorreu =
    hoje.getMonth() > nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());

  if (!aniversarioJaOcorreu) idade--;

  return idade;
}
