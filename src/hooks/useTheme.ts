import { useEffect, useState, useCallback } from 'react';

function getIsDark() {
  return document.documentElement.classList.contains('dark');
}

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Inicializa a partir do localStorage para evitar flash
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return getIsDark();
  });

  useEffect(() => {
    // Aplica a classe no mount
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    // Observa mudanças externas na classe do <html> (ex: outro componente chamou toggle)
    const observer = new MutationObserver(() => {
      setIsDark(getIsDark());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { theme: isDark ? 'dark' : 'light', toggle, isDark };
}
