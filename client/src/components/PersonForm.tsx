// client/src/components/PersonForm.tsx

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  validateCardNumber,
  formatCardNumber,
} from '@/lib/validation';
import type { Person } from '@/lib/types';

type PersonFormData = {
  name: string;
  cardNumber: string;
  document: string; // genérico (CPF, RG ou qualquer identificador)
};

interface PersonFormProps {
  onSubmit: (data: Omit<Person, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  initialData?: Partial<Person>;
  submitLabel?: string;
}

/**
 * Regra:
 * - Nenhum campo obrigatório.
 * - cardNumber: usa validação existente (apenas dígitos, etc).
 * - document: genérico, sem formato automático; só bloqueia coisa muito absurda.
 */
const personSchema = z.object({
  name: z.string().optional(),
  cardNumber: z
    .string()
    .optional()
    .refine((v) => !v || validateCardNumber(v), {
      message: 'Número de cartão inválido.',
    }),
  document: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v ||
        /^[0-9A-Za-z.\-\/\s]{3,40}$/.test(v),
      {
        message:
          'Documento inválido. Use apenas números, letras e . - /',
      }
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
      // prioriza `document`; se não existir, tenta cpf/rg antigos
      document:
        initialData?.document ??
        initialData?.cpf ??
        initialData?.rg ??
        '',
    },
  });

  const handleLocalSubmit: SubmitHandler<PersonFormData> = (data) => {
    const payload: Omit<Person, 'id' | 'createdAt'> = {
      name: (data.name || '').trim(),
      cardNumber: (data.cardNumber || '').trim(),
      document: (data.document || '').trim(),
      // cpf / rg antigos não são mais preenchidos automaticamente
    };

    onSubmit(payload);

    // criação: limpa tudo pra fluxo rápido
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
              autoFocus
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
              placeholder="Ex: 1234"
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
        <Label htmlFor="document">
          Documento (CPF, RG ou outro) — opcional
        </Label>
        <Controller
          name="document"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="document"
              onChange={(e) => field.onChange(e.target.value)}
              placeholder="Digite exatamente como deseja ver (ex: 13166788964)"
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
