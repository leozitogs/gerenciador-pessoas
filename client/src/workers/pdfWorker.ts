/// <reference lib="webworker" />

import { generatePDF } from '@/lib/pdfGenerator';
import type { PDFExportType, Person } from '@/lib/types';

interface GeneratePDFPayload {
  people: Person[];
  title: string;
  type: PDFExportType;
  /**
   * Se não for enviado, assumimos true para manter comportamento seguro:
   * documentos mascarados.
   */
  maskDocuments?: boolean;
}

self.onmessage = async (event: MessageEvent<GeneratePDFPayload>) => {
  const { people, title, type, maskDocuments = true } = event.data;

  try {
    const pdfBytes = await generatePDF({
      people,
      title,
      type,
      maskDocuments,
    });

    // envia de volta para a thread principal
    (self as unknown as Worker).postMessage(
      { ok: true, pdfBytes },
      [pdfBytes.buffer] // transfere o buffer para eficiência
    );
  } catch (error: any) {
    (self as unknown as Worker).postMessage({
      ok: false,
      error: error?.message || 'Erro ao gerar PDF no worker',
    });
  }
};
