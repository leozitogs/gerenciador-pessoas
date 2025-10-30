export interface Person {
  id: string;
  name: string;
  cardNumber: string;
  cpf: string;
  rg: string;
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
}
