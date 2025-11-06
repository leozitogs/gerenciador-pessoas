// client/src/hooks/usePDFExport.ts

import { useState } from 'react';
import { generatePDF, generatePDFFilename } from '@/lib/pdfGenerator';
import type { PDFExportOptions } from '@/lib/types';

export function usePDFExport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPDF = async (options: PDFExportOptions): Promise<boolean> => {
    if (!options.people || options.people.length === 0) {
      setError('Nenhuma pessoa cadastrada para exportar.');
      return false;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // generatePDF retorna Uint8Array
      const bytes: Uint8Array = await generatePDF(options);
      const filename = generatePDFFilename(options.title);

      // Uint8Array é um ArrayBufferView, aceito como BlobPart
      const blob = new Blob([bytes], {
        type: 'application/pdf',
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      console.error(err);
      setError('Erro ao gerar PDF.');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return { exportPDF, isGenerating, error };
}
