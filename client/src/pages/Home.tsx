import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonForm } from '@/components/PersonForm';
import { PeopleList } from '@/components/PeopleList';
import { EditPersonDialog } from '@/components/EditPersonDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ExportPDFDialog } from '@/components/ExportPDFDialog';
import { usePeople } from '@/hooks/usePeople';
import { usePDFExport } from '@/hooks/usePDFExport';
import { toast } from 'sonner';
import { Trash2, Undo2, FileDown, Users } from 'lucide-react';
import type { Person, PDFExportType } from '@/lib/types';
import { APP_TITLE } from '@/const';

export default function Home() {
  const {
    people,
    addPerson,
    updatePerson,
    removePerson,
    removeAll,
    undo,
    canUndo,
    lastUsedTitle,
    saveLastUsedTitle,
    storageError,
  } = usePeople();

  const { exportPDF, isGenerating, error: pdfError } = usePDFExport();

  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [personToRemove, setPersonToRemove] = useState<string | null>(null);
  const [showRemoveAllDialog, setShowRemoveAllDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleAddPerson = (data: Omit<Person, 'id' | 'createdAt'>) => {
    addPerson(data);
    toast.success('Pessoa adicionada com sucesso!');
  };

  const handleUpdatePerson = (id: string, data: Omit<Person, 'id' | 'createdAt'>) => {
    updatePerson(id, data);
    toast.success('Pessoa atualizada com sucesso!');
  };

  const handleRemovePerson = (id: string) => {
    removePerson(id);
    setPersonToRemove(null);
    toast.success('Pessoa removida com sucesso!', {
      action: canUndo
        ? {
            label: 'Desfazer',
            onClick: () => {
              undo();
              toast.success('Remoção desfeita!');
            },
          }
        : undefined,
    });
  };

  const handleRemoveAll = () => {
    removeAll();
    setShowRemoveAllDialog(false);
    toast.success('Todas as pessoas foram removidas!', {
      action: canUndo
        ? {
            label: 'Desfazer',
            onClick: () => {
              undo();
              toast.success('Remoção desfeita!');
            },
          }
        : undefined,
    });
  };

  const handleExportPDF = async (title: string, type: PDFExportType) => {
    saveLastUsedTitle(title);
    const success = await exportPDF({ people, title, type });
    
    if (success) {
      toast.success('PDF gerado com sucesso!');
      setShowExportDialog(false);
    } else {
      toast.error(pdfError || 'Erro ao gerar PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            {APP_TITLE}
          </h1>
          <p className="text-muted-foreground">
            Gerencie pessoas e exporte listas em PDF com facilidade
          </p>
        </div>

        {/* Storage Error Alert */}
        {storageError && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{storageError}</p>
            </CardContent>
          </Card>
        )}

        {/* Add Person Form */}
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle>Adicionar Pessoa</CardTitle>
            <CardDescription>
              Preencha os campos abaixo. Nenhum campo é obrigatório.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PersonForm onSubmit={handleAddPerson} submitLabel="Adicionar" />
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="sticky top-4 z-10 backdrop-blur-sm bg-white/80 rounded-lg border p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                {people.length} {people.length === 1 ? 'pessoa' : 'pessoas'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {canUndo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  className="gap-2"
                >
                  <Undo2 className="h-4 w-4" />
                  Desfazer
                </Button>
              )}
              {people.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExportDialog(true)}
                    disabled={isGenerating}
                    className="gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Exportar PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRemoveAllDialog(true)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover Todos
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* People List */}
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle>Lista de Pessoas</CardTitle>
            <CardDescription>
              Ordenada alfabeticamente. Clique em editar ou remover para gerenciar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PeopleList
              people={people}
              onEdit={setEditingPerson}
              onRemove={setPersonToRemove}
            />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <EditPersonDialog
          open={!!editingPerson}
          onOpenChange={(open) => !open && setEditingPerson(null)}
          person={editingPerson}
          onSave={handleUpdatePerson}
        />

        <ConfirmDialog
          open={!!personToRemove}
          onOpenChange={(open) => !open && setPersonToRemove(null)}
          onConfirm={() => personToRemove && handleRemovePerson(personToRemove)}
          title="Remover Pessoa"
          description="Tem certeza que deseja remover esta pessoa? Esta ação pode ser desfeita."
          confirmLabel="Remover"
        />

        <ConfirmDialog
          open={showRemoveAllDialog}
          onOpenChange={setShowRemoveAllDialog}
          onConfirm={handleRemoveAll}
          title="Remover Todas as Pessoas"
          description={`Tem certeza que deseja remover todas as ${people.length} pessoas? Esta ação pode ser desfeita.`}
          confirmLabel="Remover Todas"
        />

        <ExportPDFDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          onExport={handleExportPDF}
          lastUsedTitle={lastUsedTitle}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
