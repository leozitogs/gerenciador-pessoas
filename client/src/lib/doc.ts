// client/src/lib/doc.ts

/**
 * Normaliza o documento apenas removendo espaços nas pontas.
 * Não insere pontos, traços ou qualquer formatação automática.
 * O valor exibido é o que o usuário digitou.
 */
export function formataDocumento(input: string): string {
  return (input || '').trim();
}

/**
 * Retorna o documento mascarado:
 * mantém apenas os 3 primeiros caracteres alfanuméricos (0-9, A-Z),
 * o restante vira "*".
 * Caracteres não alfanuméricos (ponto, traço, espaço) são mantidos como estão.
 */
export function mascaraDocumento(input: string): string {
  const value = formataDocumento(input);
  if (!value) return '';

  let count = 0;

  return value.replace(/[0-9A-Za-z]/g, (ch) => {
    count += 1;
    return count <= 3 ? ch : '*';
  });
}
