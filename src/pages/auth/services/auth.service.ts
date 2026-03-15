import { signUp, confirmSignUp, signIn, fetchAuthSession } from 'aws-amplify/auth';
import { api } from '@/services/api.service';

export async function registerUser(email: string, password: string, name: string) {
  return signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        name,
      },
    },
  });
}

export async function confirmUserSignUp(email: string, code: string) {
  return confirmSignUp({
    username: email,
    confirmationCode: code,
  });
}

export async function setupUserAfterConfirmation(
  email: string,
  password: string,
  name: string,
): Promise<void> {
  await signIn({ username: email, password });
  await fetchAuthSession({ forceRefresh: true });

  // Cria a família padrão
  const { data: family } = await api.post('/finance/families', {
    name: `Família de ${name}`,
  });

  // Cria o person — userId vem do token JWT via backend
  await api.post('/finance/persons', {
    name,
    familyId: family.id,
  });
}
