import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const result = await signUp(email, password, name);

      if (result?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        navigate('/confirmar-cadastro', {
          state: { email, password, name, phone, cpf, birthDate },
        });
        return;
      }

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
              placeholder="Seu nome completo"
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

            <Input
              label="Telefone"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, '').slice(0, 11);
                if (v.length <= 10) {
                  v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                  v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
                setPhone(v);
              }}
            />

            <Input
              label="CPF"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => {
                const v = e.target.value
                  .replace(/\D/g, '')
                  .slice(0, 11)
                  .replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
                setCpf(v);
              }}
            />

            <Input
              type="date"
              label="Data de Nascimento"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />

            {error && <p className="text-sm text-danger-600">{error}</p>}

            <Button type="submit" variant="primary" isLoading={loading} className="w-full">
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </Button>

            <p className="text-center text-sm text-primary-500">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary-700 font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
