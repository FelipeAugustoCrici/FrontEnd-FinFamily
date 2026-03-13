import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from './hooks/useSignUp';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function Register() {
  const navigate = useNavigate();
  const { signUp, loading } = useSignUp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const result = await signUp(email, password, name);

      if (result?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        navigate('/confirmar-cadastro', {
          state: { email },
        });
        return;
      }

      // fallback: navigate to login after successful signup
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta.';
      setError(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50/30 p-4">
      <div className="w-full max-w-md">
        <Card title="Criar conta" description="Cadastre-se para começar a usar o FinFamily">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="seu@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-sm text-danger-600">{error}</p>}

            <div className="flex justify-end">
              <Button type="submit" variant="primary" isLoading={loading} className="w-full">
                {loading ? 'Criando conta...' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
