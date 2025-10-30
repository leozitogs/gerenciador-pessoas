import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  validateCPF,
  validateRG,
  validateCardNumber,
  formatCPF,
  formatRG,
  formatCardNumber,
} from '@/lib/validation';
import type { Person } from '@/lib/types';

const personSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cardNumber: z.string().min(1, 'Número do cartão é obrigatório').refine(validateCardNumber, {
    message: 'Número de cartão inválido (apenas dígitos e espaços)',
  }),
  cpf: z.string().min(1, 'CPF é obrigatório').refine(validateCPF, {
    message: 'CPF inválido',
  }),
  rg: z.string().min(1, 'RG é obrigatório').refine(validateRG, {
    message: 'RG inválido (apenas dígitos e X)',
  }),
});

type PersonFormData = z.infer<typeof personSchema>;

interface PersonFormProps {
  onSubmit: (data: Omit<Person, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  initialData?: Partial<Person>;
  submitLabel?: string;
}

export function PersonForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Salvar',
}: PersonFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: initialData?.name || '',
      cardNumber: initialData?.cardNumber || '',
      cpf: initialData?.cpf || '',
      rg: initialData?.rg || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="name"
              placeholder="Digite o nome"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
          )}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número do Cartão</Label>
        <Controller
          name="cardNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="cardNumber"
              onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
              placeholder="Digite o número do cartão"
              aria-invalid={!!errors.cardNumber}
              aria-describedby={errors.cardNumber ? 'card-error' : undefined}
            />
          )}
        />
        {errors.cardNumber && (
          <p id="card-error" className="text-sm text-destructive">
            {errors.cardNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Controller
          name="cpf"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="cpf"
              onChange={(e) => field.onChange(formatCPF(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              aria-invalid={!!errors.cpf}
              aria-describedby={errors.cpf ? 'cpf-error' : undefined}
            />
          )}
        />
        {errors.cpf && (
          <p id="cpf-error" className="text-sm text-destructive">
            {errors.cpf.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rg">RG</Label>
        <Controller
          name="rg"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="rg"
              onChange={(e) => field.onChange(formatRG(e.target.value))}
              placeholder="Digite o RG"
              aria-invalid={!!errors.rg}
              aria-describedby={errors.rg ? 'rg-error' : undefined}
            />
          )}
        />
        {errors.rg && (
          <p id="rg-error" className="text-sm text-destructive">
            {errors.rg.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
