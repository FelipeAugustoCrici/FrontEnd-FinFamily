const ERROR_MAP: Record<string, string> = {
  UsernameExistsException: 'Este email já está cadastrado.',
  UserNotFoundException: 'Usuário não encontrado.',
  NotAuthorizedException: 'Email ou senha incorretos.',
  CodeMismatchException: 'Código de verificação inválido.',
  ExpiredCodeException: 'O código de verificação expirou. Solicite um novo.',
  LimitExceededException: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  TooManyRequestsException: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  InvalidPasswordException: 'A senha não atende aos requisitos mínimos de segurança.',
  InvalidParameterException: 'Dados inválidos. Verifique as informações e tente novamente.',
  UserNotConfirmedException: 'Conta não confirmada. Verifique seu email.',
  NetworkError: 'Erro de conexão. Verifique sua internet e tente novamente.',
};

export function translateAuthError(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Ocorreu um erro inesperado.';

  const error = err as { name?: string; code?: string; message?: string };
  const key = error.name ?? error.code ?? '';

  return ERROR_MAP[key] ?? error.message ?? 'Ocorreu um erro inesperado.';
}
