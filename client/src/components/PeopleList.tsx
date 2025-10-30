import { List } from 'react-window';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Person } from '@/lib/types';
import { maskCardNumber } from '@/lib/validation';
import type { CSSProperties } from 'react';

interface PeopleListProps {
  people: Person[];
  onEdit: (person: Person) => void;
  onRemove: (id: string) => void;
}

interface RowComponentProps {
  people: Person[];
  onEdit: (person: Person) => void;
  onRemove: (id: string) => void;
}

function RowComponent({
  index,
  style,
  people,
  onEdit,
  onRemove,
}: {
  index: number;
  style: CSSProperties;
  ariaAttributes: {
    'aria-posinset': number;
    'aria-setsize': number;
    role: 'listitem';
  };
} & RowComponentProps) {
  const person = people[index];
  const maskedCard = maskCardNumber(person.cardNumber);

  return (
    <div style={style} className="px-4">
      <Card className="p-4 flex items-center justify-between gap-4 hover:bg-accent/50 transition-colors">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Nome</p>
            <p className="font-medium truncate">{person.name || '(sem nome)'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cartão</p>
            <p className="font-mono text-sm truncate">{maskedCard || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">CPF</p>
            <p className="font-mono text-sm truncate">{person.cpf || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">RG</p>
            <p className="font-mono text-sm truncate">{person.rg || '—'}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(person)}
            aria-label={`Editar ${person.name || 'pessoa'}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRemove(person.id)}
            aria-label={`Remover ${person.name || 'pessoa'}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function PeopleList({ people, onEdit, onRemove }: PeopleListProps) {
  if (people.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Nenhuma pessoa cadastrada. Adicione a primeira pessoa usando o formulário acima.
        </p>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <List
        rowComponent={RowComponent}
        rowProps={{ people, onEdit, onRemove }}
        rowCount={people.length}
        rowHeight={120}
        style={{ height: 600, width: '100%' }}
      />
    </div>
  );
}
