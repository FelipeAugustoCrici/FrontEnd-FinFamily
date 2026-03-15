import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSignUp } from './hooks/useSignUp';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function ConfirmSignUp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { confirm, loading } = useSignUp();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await confirm(state.email, code, state.password, state.name, state.phone, state.cpf, state.birthDate);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao confirmar cadastro.';
      setError(message);
    }
  }

  if (!state?.email || !state?.password || !state?.name) {
    return <p className="text-center text-sm text-danger-600">Fluxo inválido</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50/30 p-4">
      <div className="w-full max-w-md">
        <Card title="Confirmar cadastro" description="Digite o código enviado para o seu email">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Código"
              placeholder="Código recebido por email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            {error && <p className="text-sm text-danger-600">{error}</p>}

            <div className="flex justify-end">
              <Button type="submit" isLoading={loading} className="w-full">
                {loading ? 'Confirmando...' : 'Confirmar'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
