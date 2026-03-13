import { useState } from 'react';
import { confirmUserSignUp, registerUser } from '../services/auth.service';

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

  async function confirm(email: string, code: string) {
    setLoading(true);
    try {
      await confirmUserSignUp(email, code);
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
