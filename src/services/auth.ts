import { fetchAuthSession, signIn } from 'aws-amplify/auth';

export async function login(email: string, password: string) {
  const response = await signIn({
    username: email,
    password,
  });

  if (response.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
    return {
      status: 'NEW_PASSWORD_REQUIRED',
      user: response,
    };
  }

  await fetchAuthSession();

  return {
    status: 'SIGNED_IN',
  };
}
