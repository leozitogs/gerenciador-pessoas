import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  masked: boolean;
  onToggle: () => void;
}

export default function ToggleMaskButton({ masked, onToggle }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onToggle}
      aria-pressed={!masked ? 'true' : 'false'}
      className="gap-2 transition active:scale-[.98]"
      title={masked ? 'Mostrar Documento' : 'Ocultar Documento'}
    >
      <span className="inline-block transition-transform duration-150 will-change-transform">
        {masked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 rotate-6" />}
      </span>
      {masked ? 'Mostrar Doc.' : 'Ocultar Doc.'}
    </Button>
  );
}
