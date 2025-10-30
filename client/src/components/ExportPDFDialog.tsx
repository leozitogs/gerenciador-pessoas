import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, List, FileSignature } from 'lucide-react';
import type { PDFExportType } from '@/lib/types';

interface ExportPDFDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (title: string, type: PDFExportType) => void;
  lastUsedTitle?: string;
  isGenerating: boolean;
}

const exportTypes: {
  type: PDFExportType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    type: 'table',
    label: 'Tabela',
    description: 'Lista em formato de tabela com bordas e colunas',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    type: 'continuous',
    label: 'Contínuo',
    description: 'Lista limpa sem linhas, otimizada para leitura',
    icon: <List className="h-5 w-5" />,
  },
  {
    type: 'signatures',
    label: 'Assinaturas',
    description: 'Cada nome com espaço para assinatura manuscrita',
    icon: <FileSignature className="h-5 w-5" />,
  },
];

export function ExportPDFDialog({
  open,
  onOpenChange,
  onExport,
  lastUsedTitle,
  isGenerating,
}: ExportPDFDialogProps) {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<PDFExportType>('table');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && lastUsedTitle) {
      setTitle(lastUsedTitle);
    }
  }, [open, lastUsedTitle]);

  const handleExport = () => {
    if (!title.trim()) {
      setError('O título é obrigatório');
      return;
    }

    setError('');
    onExport(title, selectedType);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleExport();
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Exportar PDF</DialogTitle>
          <DialogDescription>
            Escolha o formato e defina um título para o documento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdf-title">
              Título do Documento <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pdf-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="Ex: Lista de Participantes - Evento 2025"
              disabled={isGenerating}
              aria-invalid={!!error}
              aria-describedby={error ? 'title-error' : undefined}
            />
            {error && (
              <p id="title-error" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Formato de Exportação</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {exportTypes.map(({ type, label, description, icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  disabled={isGenerating}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-left
                    ${
                      selectedType === type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }
                    ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  aria-pressed={selectedType === type}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{icon}</div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isGenerating}
            >
              Cancelar
            </Button>
            <Button onClick={handleExport} disabled={isGenerating}>
              {isGenerating ? 'Gerando PDF...' : 'Exportar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
