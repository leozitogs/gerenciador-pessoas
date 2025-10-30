import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PersonForm } from './PersonForm';
import type { Person } from '@/lib/types';

interface EditPersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: Person | null;
  onSave: (id: string, data: Omit<Person, 'id' | 'createdAt'>) => void;
}

export function EditPersonDialog({
  open,
  onOpenChange,
  person,
  onSave,
}: EditPersonDialogProps) {
  if (!person) return null;

  const handleSubmit = (data: Omit<Person, 'id' | 'createdAt'>) => {
    onSave(person.id, data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pessoa</DialogTitle>
          <DialogDescription>
            Atualize as informações da pessoa abaixo.
          </DialogDescription>
        </DialogHeader>
        <PersonForm
          initialData={person}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Salvar Alterações"
        />
      </DialogContent>
    </Dialog>
  );
}
