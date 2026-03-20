import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignUp } from './hooks/useSignUp';
import {
  User, Mail, Lock, Phone, CreditCard, Calendar,
  Eye, EyeOff, Loader2, Sparkles, ChevronRight, ChevronLeft, KeyRound, Sun, Moon,
} from 'lucide-react';
import { useTokens } from '@/hooks/useTokens';
import { useTheme } from '@/hooks/useTheme';

const STEPS = ['Dados pessoais', 'Contato', 'Confirmação'];

export function Register() {
  const navigate = useNavigate();
  const { signUp, confirm, loading } = useSignUp();
  const t = useTokens();
  const isDark = t.bg.page === '#020617';
  const { toggle } = useTheme();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

if (step === 1) { setStep(2); return; }

if (step === 2) {
      try {
        const result = await signUp(email, password, name);
        if (result?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
          setStep(3);
        } else {
          navigate('/login', { replace: true });
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
      }
      return;
    }

try {
      await confirm(email, code, password, name, phone, cpf, birthDate);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código inválido. Tente novamente.');
    }
  }

  const inputStyle = (field: string, pl = 42, pr = 14) => ({
    width: '100%', height: 46,
    padding: `0 ${pr}px 0 ${pl}px`,
    borderRadius: 12,
    border: `1.5px solid ${focused === field ? t.border.focus : t.border.input}`,
    background: t.bg.input, color: t.text.primary, fontSize: 14, outline: 'none',
    boxShadow: focused === field ? t.shadow.focus : 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    boxSizing: 'border-box' as const,
  });

  const iconStyle = (field: string) => ({
    position: 'absolute' as const, left: 13, top: '50%', transform: 'translateY(-50%)',
    color: focused === field ? t.border.focus : t.text.muted,
    pointerEvents: 'none' as const, transition: 'color 0.18s',
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      position: 'relative',
      background: isDark
        ? 'radial-gradient(ellipse at 40% 0%, rgba(99,102,241,0.12) 0%, #020617 55%)'
        : 'radial-gradient(ellipse at 40% 0%, rgba(99,102,241,0.07) 0%, #f1f5f9 55%)',
    }}>
      {}
      <button
        onClick={toggle}
        title={isDark ? 'Modo claro' : 'Modo escuro'}
        style={{
          position: 'fixed', top: 16, right: 16,
          width: 38, height: 38, borderRadius: 10,
          border: `1px solid ${t.border.default}`,
          background: t.bg.card, color: t.text.muted,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: t.shadow.card, transition: 'background 0.2s, color 0.2s', zIndex: 100,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = t.text.primary; (e.currentTarget as HTMLElement).style.background = t.bg.cardHover; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = t.text.muted; (e.currentTarget as HTMLElement).style.background = t.bg.card; }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            marginBottom: 14,
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: t.text.primary, margin: 0 }}>
            Criar sua conta
          </h1>
          <p style={{ fontSize: 13, color: t.text.muted, marginTop: 6 }}>
            Comece a organizar as finanças da sua família hoje
          </p>
        </div>

        {}
        <div style={{
          background: t.bg.card,
          border: `1px solid ${t.border.default}`,
          borderRadius: 20,
          padding: '28px 28px 24px',
          boxShadow: t.shadow.cardLg,
        }}>

          {}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            {STEPS.map((label, i) => {
              const idx = i + 1;
              const isActive = step === idx;
              const isDone = step > idx;
              const isLast = idx === STEPS.length;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 'none' : 1 }}>
                  {}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone
                        ? '#6366f1'
                        : isActive
                        ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                        : t.bg.muted,
                      color: isDone || isActive ? '#fff' : t.text.muted,
                      boxShadow: isActive ? '0 2px 8px rgba(99,102,241,0.35)' : 'none',
                      transition: 'all 0.2s',
                    }}>
                      {isDone ? '✓' : idx}
                    </div>
                    <span style={{
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? t.text.primary : t.text.muted,
                      whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </span>
                  </div>
                  {}
                  {!isLast && (
                    <div style={{
                      flex: 1, height: 1, margin: '0 8px',
                      background: isDone ? '#6366f1' : t.border.divider,
                      transition: 'background 0.3s',
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {}
            {step === 1 && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: t.text.secondary }}>Nome completo</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={iconStyle('name')} />
                    <input
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      required
                      style={inputStyle('name')}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: t.text.secondary }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={iconStyle('email')} />
                    <input
                      type="email"
                      placeholder="seu@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      required
                      style={inputStyle('email')}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: t.text.secondary }}>Senha</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={iconStyle('password')} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      required
                      style={inputStyle('password', 42, 42)}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                      color: t.text.muted, display: 'flex', alignItems: 'center',
                    }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {}
            {step === 2 && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: t.text.secondary }}>
                    Telefone <span style={{ color: t.text.muted, fontWeight: 400 }}>(opcional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={iconStyle('phone')} />
                    <input
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused(null)}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
                        if (v.length <= 10) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                        else v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                        setPhone(v);
                      }}
                      style={inputStyle('phone')}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: t.text.secondary }}>
                    CPF <span style={{ color: t.text.muted, fontWeight: 400 }}>(opcional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={16} style={iconStyle('cpf')} />
                    <input
                      placeholder="000.000.000-00"
                      value={cpf}
                      onFocus={() => setFocused('cpf')}
                      onBlur={() => setFocused(null)}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 11)
                          .replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
                        setCpf(v);
                      }}
                      style={inputStyle('cpf')}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: t.text.secondary }}>
                    Data de nascimento <span style={{ color: t.text.muted, fontWeight: 400 }}>(opcional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={iconStyle('birth')} />
                    <input
                      type="date"
                      value={birthDate}
                      onFocus={() => setFocused('birth')}
                      onBlur={() => setFocused(null)}
                      onChange={(e) => setBirthDate(e.target.value)}
                      style={inputStyle('birth')}
                    />
                  </div>
                </div>
              </>
            )}

            {}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {}
                <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 48, height: 48, borderRadius: 14,
                    background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff',
                    marginBottom: 10,
                  }}>
                    <KeyRound size={22} color="#6366f1" />
                  </div>
                  <p style={{ fontSize: 13, color: t.text.secondary, margin: 0 }}>
                    Enviamos um código para
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: t.text.primary, marginTop: 2 }}>
                    {email}
                  </p>
                </div>

                {}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: t.text.secondary }}>
                    Código de verificação
                  </label>
                  <input
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onFocus={() => setFocused('code')}
                    onBlur={() => setFocused(null)}
                    required
                    maxLength={6}
                    style={{
                      width: '100%', height: 56, padding: '0 16px',
                      borderRadius: 12,
                      border: `1.5px solid ${focused === 'code' ? t.border.focus : t.border.input}`,
                      background: t.bg.input, color: t.text.primary,
                      fontSize: 24, fontWeight: 700, letterSpacing: '0.35em', textAlign: 'center',
                      outline: 'none',
                      boxShadow: focused === 'code' ? t.shadow.focus : 'none',
                      transition: 'border-color 0.18s, box-shadow 0.18s',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            )}

            {}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: isDark ? 'rgba(252,165,165,0.08)' : '#fef2f2',
                border: `1px solid ${isDark ? 'rgba(252,165,165,0.2)' : '#fecdd3'}`,
                fontSize: 13, color: isDark ? '#fca5a5' : '#991b1b',
              }}>
                {error}
              </div>
            )}

            {}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {step > 1 && step < 3 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  style={{
                    height: 46, padding: '0 18px', borderRadius: 12,
                    border: `1.5px solid ${t.border.input}`,
                    background: 'transparent', color: t.text.secondary,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = t.bg.muted)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <ChevronLeft size={15} /> Voltar
                </button>
              )}

              <button
                type="submit"
                disabled={loading || (step === 3 && code.length < 6)}
                style={{
                  flex: 1, height: 46, borderRadius: 12, border: 'none',
                  background: (loading || (step === 3 && code.length < 6))
                    ? (isDark ? 'rgba(99,102,241,0.4)' : '#a5b4fc')
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#ffffff', fontSize: 14, fontWeight: 700,
                  cursor: (loading || (step === 3 && code.length < 6)) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: (loading || (step === 3 && code.length < 6)) ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
                  transition: 'opacity 0.18s',
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                {loading ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  {step === 2 ? 'Criando conta...' : 'Confirmando...'}</>
                ) : step === 1 ? (
                  <>Continuar <ChevronRight size={15} /></>
                ) : step === 2 ? (
                  <>Criar conta <ChevronRight size={15} /></>
                ) : (
                  'Confirmar cadastro'
                )}
              </button>
            </div>

            {step < 3 && (
              <p style={{ textAlign: 'center', fontSize: 13, color: t.text.muted, margin: 0 }}>
                Já tem uma conta?{' '}
                <Link to="/login" style={{ color: t.text.link, fontWeight: 600, textDecoration: 'none' }}>
                  Entrar
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
