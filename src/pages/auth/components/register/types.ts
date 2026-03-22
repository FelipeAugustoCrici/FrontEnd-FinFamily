import type { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import type { RegisterStep1Data } from '../../schemas/register.schema';

export interface SharedInputProps {
  focused: string | null;
  setFocused: (field: string | null) => void;
}

export interface Step1Props extends SharedInputProps {
  register: UseFormRegister<RegisterStep1Data>;
  setValue: UseFormSetValue<RegisterStep1Data>;
  errors: FieldErrors<RegisterStep1Data>;
  password: string;
  showPassword: boolean;
  setShowPassword: (v: boolean | ((prev: boolean) => boolean)) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface Step2Props extends SharedInputProps {
  phone: string;
  setPhone: (v: string) => void;
  cpf: string;
  setCpf: (v: string) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface Step3Props extends SharedInputProps {
  email: string;
  code: string;
  setCode: (v: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}
