import { useTheme } from './useTheme';
import { LIGHT, DARK, type Tokens } from '@/theme/tokens';

export function useTokens(): Tokens {
  const { isDark } = useTheme();
  return isDark ? DARK : LIGHT;
}
