import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { Input } from './Input';

interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  value?: string | number;
  onChange?: (value: string) => void;
}

/**
 * Formata um número para o padrão brasileiro (1.234,56)
 */
function formatCurrency(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  if (!numbers) return '';

  // Converte para número e divide por 100 para ter os centavos
  const amount = parseFloat(numbers) / 100;

  // Formata com separadores brasileiros
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Remove a formatação e retorna apenas o valor numérico
 */
function unformatCurrency(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '0';
  return (parseFloat(numbers) / 100).toFixed(2);
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, error, icon, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const isInitialMount = useRef(true);

    // Atualizar display apenas na montagem inicial ou quando o valor externo mudar significativamente
    useEffect(() => {
      if (isInitialMount.current && value !== undefined) {
        isInitialMount.current = false;
        const numValue = typeof value === 'number' ? value.toString() : value;
        if (numValue && numValue !== '0' && numValue !== '0.00') {
          // Converter o valor numérico para centavos e formatar
          const valueInCents = Math.round(parseFloat(numValue) * 100).toString();
          const formatted = formatCurrency(valueInCents);
          setDisplayValue(formatted);
        } else {
          setDisplayValue('');
        }
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Formatar o valor
      const formatted = formatCurrency(inputValue);
      setDisplayValue(formatted);

      // Chamar onChange com o valor não formatado
      if (onChange) {
        const unformatted = unformatCurrency(inputValue);
        onChange(unformatted);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        label={label}
        error={error}
        icon={icon}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
      />
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';
