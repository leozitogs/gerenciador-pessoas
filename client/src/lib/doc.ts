// client/src/lib/doc.ts
export function soDigitos(v: string) {
  return (v || "").replace(/\D+/g, "");
}

// ---------- CPF ----------
export function validaCPF(cpf: string) {
  const s = soDigitos(cpf);
  if (s.length !== 11 || /^(\d)\1{10}$/.test(s)) return false;

  const calc = (b: number) => {
    let sum = 0;
    for (let i = 0; i < b - 1; i++) sum += parseInt(s[i], 10) * (b - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(10) === parseInt(s[9], 10) && calc(11) === parseInt(s[10], 10);
}

export function formataCPF(cpf: string) {
  const s = soDigitos(cpf).slice(0, 11);
  if (s.length <= 3) return s;
  if (s.length <= 6) return `${s.slice(0, 3)}.${s.slice(3)}`;
  if (s.length <= 9) return `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6)}`;
  return `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6, 9)}-${s.slice(9)}`;
}

// ---------- RG (simplificado e permissivo: dígitos e X) ----------
export function limpaRG(v: string) {
  return (v || "").toUpperCase().replace(/[^0-9X]/g, "");
}
export function formataRG(rg: string) {
  const s = limpaRG(rg).slice(0, 12);
  // Estilo 2.XXX.XXX-X adaptativo (não é estadual-específico)
  if (s.length <= 2) return s;
  if (s.length <= 5) return `${s.slice(0, 2)}.${s.slice(2)}`;
  if (s.length <= 8) return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5)}`;
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5, 8)}-${s.slice(8)}`;
}

// ---------- Documento Unificado ----------
export type DocTipo = "cpf" | "rg";
export function tipoDocumento(input: string): DocTipo {
  const dig = soDigitos(input);
  return dig.length === 11 ? "cpf" : "rg";
}
export function formataDocumento(input: string) {
  return tipoDocumento(input) === "cpf" ? formataCPF(input) : formataRG(input);
}
export function documentoValido(input: string) {
  return tipoDocumento(input) === "cpf" ? validaCPF(input) : limpaRG(input).length >= 5;
}
export function mascaraDocumento(input: string) {
  const f = formataDocumento(input);
  // Deixa só últimos 3 visíveis
  return f.replace(/[\dX](?=[\dX\W]{3})/g, "*");
}

// ---------- Cartão (sem máscara) ----------
export function formataCartao(v: string) {
  const s = soDigitos(v).slice(0, 16);
  return s.replace(/(\d{4})(?=\d)/g, "$1 ");
}
