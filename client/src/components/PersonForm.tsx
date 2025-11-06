import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

type PersonFormData = {
  name: string;
  cardNumber: string;
  document: string; // CPF ou RG em um campo só
};

interface PersonFormProps {
  onSubmit: (data: Omit<Person, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  initialData?: Partial<Person>;
  submitLabel?: string;
}

const personSchema = z.object({
  name: z.string().optional(),
  cardNumber: z
    .string()
    .optional()
    .refine((v) => !v || validateCardNumber(v), {
      message: 'Número de cartão inválido (apenas dígitos e espaços)',
    }),
  document: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (!v) return true; // opcional
        const only = v.replace(/\D+/g, '');
        return only.length === 11 ? validateCPF(v) : validateRG(v);
      },
      { message: 'Documento inválido (CPF ou RG)' }
    ),
});

export function PersonForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Salvar',
}: PersonFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema) as any,
    defaultValues: {
      name: initialData?.name ?? '',
      cardNumber: initialData?.cardNumber ?? '',
      // se existir cpf ou rg, mostra no campo unificado
      document: initialData?.cpf ?? initialData?.rg ?? '',
    },
  });

  const handleLocalSubmit: SubmitHandler<PersonFormData> = (data) => {
    const doc = (data.document ?? '').trim();
    const only = doc.replace(/\D+/g, '');

    const cpf = doc && only.length === 11 ? doc : '';
    const rg = doc && only.length !== 11 ? doc.toUpperCase() : '';

    const payload: Omit<Person, 'id' | 'createdAt'> = {
      name: data.name ?? '',
      cardNumber: data.cardNumber ?? '',
      cpf,
      rg,
    };

    onSubmit(payload);

    // Se for criação (sem initialData), limpa os campos após adicionar
    if (!initialData) {
      reset({
        name: '',
        cardNumber: '',
        document: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLocalSubmit)} className="space-y-4">
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
            {String(errors.name.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número do Cartão (opcional)</Label>
        <Controller
          name="cardNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="cardNumber"
              onChange={(e) =>
                field.onChange(formatCardNumber(e.target.value))
              }
              placeholder="1234 5678 9012 3456"
              aria-invalid={!!errors.cardNumber}
              aria-describedby={errors.cardNumber ? 'card-error' : undefined}
            />
          )}
        />
        {errors.cardNumber && (
          <p id="card-error" className="text-sm text-destructive">
            {String(errors.cardNumber.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">Documento (CPF ou RG) — opcional</Label>
        <Controller
          name="document"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="document"
              onChange={(e) => {
                const val = e.target.value;
                const only = val.replace(/\D+/g, '');
                field.onChange(
                  only.length === 11 ? formatCPF(val) : formatRG(val)
                );
              }}
              placeholder="000.000.000-00 ou 12.345.678-X"
              aria-invalid={!!errors.document}
              aria-describedby={errors.document ? 'doc-error' : undefined}
            />
          )}
        />
        {errors.document && (
          <p id="doc-error" className="text-sm text-destructive">
            {String(errors.document.message)}
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
