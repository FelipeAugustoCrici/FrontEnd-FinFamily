import { z } from 'zod';

export const registerStep1Schema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .refine((val) => {
      const parts = val.trim().split(/\s+/);
      return parts.length >= 2 && parts[1].length >= 1;
    }, 'Informe nome e sobrenome'),

  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .refine((val) => val === val.toLowerCase(), 'Email não pode conter letras maiúsculas'),

  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter ao menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter ao menos um caractere especial'),
});

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;
