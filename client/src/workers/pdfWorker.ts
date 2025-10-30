import { generatePDF } from '../lib/pdfGenerator';
import type { PDFExportOptions } from '../lib/types';

self.onmessage = async (e: MessageEvent<PDFExportOptions>) => {
  try {
    const { people, title, type } = e.data;
    const pdfBytes = await generatePDF({ people, title, type });
    self.postMessage({ success: true, data: pdfBytes });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao gerar PDF',
    });
  }
};
