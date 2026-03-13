import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await resetPassword({ username: email });
      setMessage('Código enviado para seu e-mail.');
      setStep('confirm');
    } catch (err) {
      console.error(err);
      setMessage('Erro ao solicitar código.');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: password,
      });
      setMessage('Senha alterada com sucesso. Faça login com a nova senha.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setMessage('Erro ao confirmar nova senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50/30 p-4">
      <div className="w-full max-w-md">
        <Card title={step === 'request' ? 'Recuperar senha' : 'Confirme a nova senha'}>
          {step === 'request' ? (
            <form onSubmit={handleRequest} className="space-y-4">
              <Input
                type="email"
                label="Email"
                placeholder="seu@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {message && <p className="text-sm text-primary-600">{message}</p>}

              <div className="flex justify-end">
                <Button type="submit" variant="primary" isLoading={loading}>
                  Enviar código
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-4">
              <Input
                label="Código"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <Input
                type="password"
                label="Nova senha"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {message && <p className="text-sm text-primary-600">{message}</p>}

              <div className="flex justify-end">
                <Button type="submit" variant="primary" isLoading={loading}>
                  Confirmar
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
