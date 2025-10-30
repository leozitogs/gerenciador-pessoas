import { useState, useCallback } from 'react';
import type { PDFExportOptions } from '@/lib/types';
import { generatePDF, generatePDFFilename } from '@/lib/pdfGenerator';

export function usePDFExport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPDF = useCallback(async (options: PDFExportOptions) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Gerar PDF diretamente (sem Web Worker por enquanto)
      const pdfBytes = await generatePDF(options);

      // Criar blob e fazer download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generatePDFFilename(options.title);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao gerar PDF';
      setError(errorMessage);
      setIsGenerating(false);
      console.error('Erro ao gerar PDF:', err);
      return false;
    }
  }, []);

  return {
    exportPDF,
    isGenerating,
    error,
  };
}
