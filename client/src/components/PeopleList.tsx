import { List } from 'react-window';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Person } from '@/lib/types';
import { formatCardNumber, formatCPF, formatRG } from '@/lib/validation';
import type { CSSProperties } from 'react';

interface PeopleListProps {
  people: Person[];
  onEdit: (person: Person) => void;
  onRemove: (id: string) => void;
  /** Controla se o Documento (CPF/RG) aparece camuflado. Default: true */
  maskDocuments?: boolean;
}

interface RowComponentProps {
  people: Person[];
  onEdit: (person: Person) => void;
  onRemove: (id: string) => void;
  maskDocuments: boolean;
}

/** Decide como formatar CPF/RG a partir do valor bruto */
function formatDocument(raw: string): string {
  if (!raw) return '';
  const only = raw.replace(/\D+/g, '');
  return only.length === 11 ? formatCPF(raw) : formatRG(raw.toUpperCase());
}

/** Camufla preservando pontuação e mantendo visíveis apenas os 3 PRIMEIROS caracteres alfanuméricos */
function maskDocumentPretty(s: string): string {
  let seen = 0;
  return (s || '')
    .split('')
    .map((ch) => {
      if (/[0-9A-Za-z]/.test(ch)) {
        seen += 1;
        return seen <= 3 ? ch : '*';
      }
      return ch;
    })
    .join('');
}

function RowComponent({
  index,
  style,
  people,
  onEdit,
  onRemove,
  maskDocuments,
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

  // Cartão sem asteriscos — apenas formatado em blocos
  const shownCard = formatCardNumber(person.cardNumber || '');

  // Documento unificado (CPF ou RG), com formatação e máscara opcional
  const rawDoc = person.cpf || person.rg || '';
  const formattedDoc = rawDoc ? formatDocument(rawDoc) : '';
  const shownDoc = formattedDoc
    ? maskDocuments
      ? maskDocumentPretty(formattedDoc)
      : formattedDoc
    : '—';

  return (
    <div style={style} className="px-4">
      <Card className="glass-card hover-grow card-appear p-4 flex items-center justify-between gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Nome</p>
            <p className="font-medium truncate">{person.name || '(sem nome)'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cartão</p>
            <p className="font-mono text-sm truncate">{shownCard || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Documento</p>
            <p className="font-mono text-sm truncate">{shownDoc}</p>
          </div>
          <div className="flex gap-2 justify-end">
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
        </div>
      </Card>
    </div>
  );
}

export function PeopleList({
  people,
  onEdit,
  onRemove,
  maskDocuments = true,
}: PeopleListProps) {
  if (people.length === 0) {
    return (
      <Card className="glass-card card-appear p-8 text-center">
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
        rowProps={{ people, onEdit, onRemove, maskDocuments }}
        rowCount={people.length}
        rowHeight={120}
        style={{ height: 600, width: '100%' }}
      />
    </div>
  );
}
