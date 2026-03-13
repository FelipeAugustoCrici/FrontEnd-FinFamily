import { signUp, confirmSignUp } from 'aws-amplify/auth';

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
