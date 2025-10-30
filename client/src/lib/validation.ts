/**
 * Validação e formatação de CPF, RG e Cartão
 */

// Remover caracteres não numéricos
export function cleanDigits(value: string): string {
  return value.replace(/\D/g, '');
}

// Formatar CPF: ###.###.###-##
export function formatCPF(value: string): string {
  const digits = cleanDigits(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

// Validar CPF com dígitos verificadores
export function validateCPF(cpf: string): boolean {
  const digits = cleanDigits(cpf);
  
  // CPF vazio é válido (campos não obrigatórios)
  if (digits.length === 0) return true;
  
  // CPF deve ter 11 dígitos
  if (digits.length !== 11) return false;
  
  // Rejeitar CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(digits)) return false;
  
  // Validar dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  
  if (parseInt(digits.charAt(9)) !== digit1) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  
  return parseInt(digits.charAt(10)) === digit2;
}

// Validar RG: aceita dígitos e X
export function validateRG(rg: string): boolean {
  // RG vazio é válido
  if (!rg.trim()) return true;
  
  // Aceitar apenas dígitos e X (maiúsculo ou minúsculo)
  return /^[\dXx]+$/.test(rg.replace(/[.\-\s]/g, ''));
}

// Formatar RG (apenas limpar, sem formatação específica)
export function formatRG(value: string): string {
  return value.replace(/[^0-9Xx]/g, '');
}

// Validar número de cartão: aceita dígitos e espaços
export function validateCardNumber(card: string): boolean {
  // Cartão vazio é válido
  if (!card.trim()) return true;
  
  // Aceitar apenas dígitos e espaços
  return /^[\d\s]+$/.test(card);
}

// Formatar número de cartão (grupos de 4 dígitos)
export function formatCardNumber(value: string): string {
  const digits = cleanDigits(value);
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.join(' ');
}

// Mascarar número de cartão: mostrar apenas os primeiros 3 caracteres
export function maskCardNumber(card: string): string {
  if (!card || card.length <= 3) return card;
  const visible = card.slice(0, 3);
  const masked = '*'.repeat(card.length - 3);
  return visible + masked;
}
