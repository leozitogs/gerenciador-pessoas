// client/src/lib/types.ts

export interface Person {
  id: string;
  name: string;

  /**
   * Cartão de inscrição interno (ex: "1234").
   * Opcional.
   */
  cardNumber?: string;

  /**
   * Campo unificado para CPF ou RG (já formatado ou bruto).
   * Opcional.
   */
  document?: string;

  /**
   * Campos legados (caso existam registros antigos).
   * Mantidos para compatibilidade; use `document` como fonte principal.
   */
  cpf?: string;
  rg?: string;

  createdAt: number; // timestamp
}

export interface AppState {
  people: Person[];
  lastUsedTitle?: string;
}

export type PDFExportType = 'table' | 'continuous' | 'signatures';

export interface PDFExportOptions {
  type: PDFExportType;
  title: string;
  people: Person[];

  /**
   * Se true: documentos serão mascarados nos PDFs.
   * Se false: documentos completos (formatados) serão exibidos.
   * Deve refletir exatamente o estado do toggle na UI.
   */
  maskDocuments: boolean;
}
