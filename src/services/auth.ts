import { fetchAuthSession, signIn, resendSignUpCode } from 'aws-amplify/auth';

export async function login(email: string, password: string) {
  let response;

  try {
    response = await signIn({ username: email, password });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'UserNotConfirmedException') {
      await resendSignUpCode({ username: email });
      return { status: 'CONFIRM_SIGN_UP' };
    }
    throw err;
  }

  if (response.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
    return {
      status: 'NEW_PASSWORD_REQUIRED',
      user: response,
    };
  }

  if (response.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
    return {
      status: 'CONFIRM_SIGN_UP',
    };
  }

  await fetchAuthSession();

  return {
    status: 'SIGNED_IN',
  };
}
