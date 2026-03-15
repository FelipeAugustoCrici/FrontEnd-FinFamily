import { useState } from 'react';
import { confirmUserSignUp, registerUser, setupUserAfterConfirmation } from '../services/auth.service';

export function useSignUp() {
  const [loading, setLoading] = useState(false);

  async function signUp(email: string, password: string, name: string) {
    setLoading(true);
    try {
      return registerUser(email, password, name);
    } finally {
      setLoading(false);
    }
  }

  async function confirm(
    email: string,
    code: string,
    password: string,
    name: string,
    phone?: string,
    cpf?: string,
    birthDate?: string,
  ) {
    setLoading(true);
    try {
      await confirmUserSignUp(email, code);
      await setupUserAfterConfirmation(email, password, name, phone, cpf, birthDate);
    } finally {
      setLoading(false);
    }
  }

  return {
    signUp,
    confirm,
    loading,
  };
}
