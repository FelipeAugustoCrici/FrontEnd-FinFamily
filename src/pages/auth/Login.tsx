import { useState } from 'react';
import { login } from '@/services/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result?.status === 'NEW_PASSWORD_REQUIRED') {
        navigate('/nova-senha', {
          state: { user: result.user },
        });
        return;
      }

      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50/30 p-4">
      <div className="w-full max-w-md">
        <Card title="Entrar" description="Acesse sua conta para gerenciar as finanças da família">
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center justify-between">
              <Link to="/esqueci-senha" className="text-sm text-primary-600 hover:underline">
                Esqueci minha senha
              </Link>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Entrar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
