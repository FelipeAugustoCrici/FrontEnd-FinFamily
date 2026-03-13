import { useLocation, useNavigate } from 'react-router-dom';
import { confirmSignIn, fetchAuthSession } from 'aws-amplify/auth';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z
  .object({
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

type FormValues = z.infer<typeof schema>;

export function NewPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<FormValues>({ resolver: zodResolver(schema) });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);

    try {
      // manter o fluxo existente (confirmSignIn recebe challengeResponse)
      await confirmSignIn({
        challengeResponse: values.password,
      });

      await fetchAuthSession();

      // opcional: reset do form
      reset();

      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao definir nova senha.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!state?.user) {
    return <p className="text-center text-sm text-danger-600">Fluxo inválido</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50/30 p-4">
      <div className="w-full max-w-md">
        <Card title="Defina sua nova senha" description="Escolha uma senha segura para continuar">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                type="password"
                label="Nova senha"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message as string}
                required
              />

              <Input
                type="password"
                label="Confirme a nova senha"
                placeholder="••••••••"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message as string}
                required
              />

              {error && <p className="text-sm text-danger-600">{error}</p>}

              <div className="flex justify-end">
                <Button type="submit" variant="primary" isLoading={loading}>
                  Salvar senha
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
}
