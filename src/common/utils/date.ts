import moment from 'moment';
// Importar locale pt-br
import 'moment/dist/locale/pt-br';

// Configurar moment para usar locale pt-BR por padrão
moment.locale('pt-br');

/**
 * Utilitários para formatação de datas usando Moment.js
 * Todas as funções usam o locale pt-BR por padrão
 */

/**
 * Capitaliza a primeira letra de uma string
 * @param str - String a ser capitalizada
 * @returns String com primeira letra maiúscula
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formata data no formato: "Sábado, 31 de Janeiro de 2026"
 * @param date - Data a ser formatada (Date, string ou timestamp)
 * @returns String formatada com dia da semana, dia, mês e ano
 * @example
 * formatLongDate(new Date('2026-01-31')) // "Sábado, 31 de Janeiro de 2026"
 */
export function formatLongDate(date: Date | string | number): string {
  const m = moment(date).locale('pt-br');
  return capitalize(m.format('dddd, DD [de] MMMM [de] YYYY'));
}

/**
 * Formata data no formato: "31 de Janeiro de 2026"
 * @param date - Data a ser formatada
 * @returns String formatada sem dia da semana
 * @example
 * formatMediumDate(new Date('2026-01-31')) // "31 de Janeiro de 2026"
 */
export function formatMediumDate(date: Date | string | number): string {
  const m = moment(date).locale('pt-br');
  return capitalize(m.format('DD [de] MMMM [de] YYYY'));
}

/**
 * Formata data no formato: "31/01/2026"
 * @param date - Data a ser formatada
 * @returns String formatada no padrão brasileiro
 * @example
 * formatShortDate(new Date('2026-01-31')) // "31/01/2026"
 */
export function formatShortDate(date: Date | string | number): string {
  return moment(date).locale('pt-br').format('DD/MM/YYYY');
}

/**
 * Formata data no formato: "31/01"
 * @param date - Data a ser formatada
 * @returns String formatada apenas com dia e mês
 * @example
 * formatDayMonth(new Date('2026-01-31')) // "31/01"
 */
export function formatDayMonth(date: Date | string | number): string {
  return moment(date).locale('pt-br').format('DD/MM');
}

/**
 * Formata data no formato: "Janeiro de 2026"
 * @param date - Data a ser formatada
 * @returns String formatada com mês e ano
 * @example
 * formatMonthYear(new Date('2026-01-31')) // "Janeiro de 2026"
 */
export function formatMonthYear(date: Date | string | number): string {
  const m = moment(date).locale('pt-br');
  return capitalize(m.format('MMMM [de] YYYY'));
}

/**
 * Formata data no formato: "Jan/2026"
 * @param date - Data a ser formatada
 * @returns String formatada com mês abreviado e ano
 * @example
 * formatShortMonthYear(new Date('2026-01-31')) // "Jan/2026"
 */
export function formatShortMonthYear(date: Date | string | number): string {
  const m = moment(date).locale('pt-br');
  return capitalize(m.format('MMM/YYYY'));
}

/**
 * Formata data e hora no formato: "31/01/2026 às 14:30"
 * @param date - Data a ser formatada
 * @returns String formatada com data e hora
 * @example
 * formatDateTime(new Date('2026-01-31T14:30:00')) // "31/01/2026 às 14:30"
 */
export function formatDateTime(date: Date | string | number): string {
  return moment(date).locale('pt-br').format('DD/MM/YYYY [às] HH:mm');
}

/**
 * Formata apenas a hora no formato: "14:30"
 * @param date - Data a ser formatada
 * @returns String formatada apenas com hora
 * @example
 * formatTime(new Date('2026-01-31T14:30:00')) // "14:30"
 */
export function formatTime(date: Date | string | number): string {
  return moment(date).locale('pt-br').format('HH:mm');
}

/**
 * Formata data de forma relativa: "hoje", "ontem", "há 3 dias"
 * @param date - Data a ser formatada
 * @returns String formatada de forma relativa
 * @example
 * formatRelativeDate(new Date()) // "hoje"
 * formatRelativeDate(new Date(Date.now() - 86400000)) // "ontem"
 */
export function formatRelativeDate(date: Date | string | number): string {
  const m = moment(date).locale('pt-br');
  const now = moment().locale('pt-br');
  const diffInDays = now.diff(m, 'days');

  if (diffInDays === 0) return 'hoje';
  if (diffInDays === 1) return 'ontem';
  if (diffInDays === -1) return 'amanhã';
  if (diffInDays > 1 && diffInDays < 7) return `há ${diffInDays} dias`;
  if (diffInDays < -1 && diffInDays > -7) return `em ${Math.abs(diffInDays)} dias`;

  // Para datas mais antigas ou futuras, usar formato curto
  return formatShortDate(date);
}

/**
 * Formata data usando fromNow do moment: "há 2 horas", "há 3 dias"
 * @param date - Data a ser formatada
 * @returns String formatada de forma relativa
 * @example
 * formatFromNow(new Date(Date.now() - 7200000)) // "há 2 horas"
 */
export function formatFromNow(date: Date | string | number): string {
  return moment(date).locale('pt-br').fromNow();
}

/**
 * Formata o dia da semana: "Sábado"
 * @param date - Data a ser formatada
 * @returns String com o dia da semana
 * @example
 * formatWeekday(new Date('2026-01-31')) // "Sábado"
 */
export function formatWeekday(date: Date | string | number): string {
  const m = moment(date).locale('pt-br');
  return capitalize(m.format('dddd'));
}

/**
 * Formata o dia da semana abreviado: "Sáb"
 * @param date - Data a ser formatada
 * @returns String com o dia da semana abreviado
 * @example
 * formatShortWeekday(new Date('2026-01-31')) // "Sáb"
 */
export function formatShortWeekday(date: Date | string | number): string {
  const m = moment(date).locale('pt-br');
  return capitalize(m.format('ddd'));
}

/**
 * Formata o mês: "Janeiro"
 * @param date - Data a ser formatada
 * @returns String com o nome do mês
 * @example
 * formatMonth(new Date('2026-01-31')) // "Janeiro"
 */
export function formatMonth(date: Date | string | number): string {
  const m = moment(date).locale('pt-br');
  return capitalize(m.format('MMMM'));
}

/**
 * Formata o mês abreviado: "Jan"
 * @param date - Data a ser formatada
 * @returns String com o nome do mês abreviado
 * @example
 * formatShortMonth(new Date('2026-01-31')) // "Jan"
 */
export function formatShortMonth(date: Date | string | number): string {
  const m = moment(date).locale('pt-br');
  return capitalize(m.format('MMM'));
}

/**
 * Formata data para input type="date" (YYYY-MM-DD)
 * @param date - Data a ser formatada
 * @returns String no formato ISO (YYYY-MM-DD)
 * @example
 * formatInputDate(new Date('2026-01-31')) // "2026-01-31"
 */
export function formatInputDate(date: Date | string | number): string {
  return moment(date).format('YYYY-MM-DD');
}

/**
 * Formata data no formato ISO completo
 * @param date - Data a ser formatada
 * @returns String no formato ISO
 * @example
 * formatISO(new Date('2026-01-31T14:30:00')) // "2026-01-31T14:30:00-03:00"
 */
export function formatISO(date: Date | string | number): string {
  return moment(date).toISOString();
}

/**
 * Verifica se uma data é hoje
 * @param date - Data a ser verificada
 * @returns true se a data é hoje
 * @example
 * isToday(new Date()) // true
 */
export function isToday(date: Date | string | number): boolean {
  return moment(date).isSame(moment(), 'day');
}

/**
 * Verifica se uma data é ontem
 * @param date - Data a ser verificada
 * @returns true se a data é ontem
 * @example
 * isYesterday(new Date(Date.now() - 86400000)) // true
 */
export function isYesterday(date: Date | string | number): boolean {
  return moment(date).isSame(moment().subtract(1, 'day'), 'day');
}

/**
 * Verifica se uma data é amanhã
 * @param date - Data a ser verificada
 * @returns true se a data é amanhã
 * @example
 * isTomorrow(new Date(Date.now() + 86400000)) // true
 */
export function isTomorrow(date: Date | string | number): boolean {
  return moment(date).isSame(moment().add(1, 'day'), 'day');
}

/**
 * Calcula a diferença entre duas datas em dias
 * @param date1 - Primeira data
 * @param date2 - Segunda data (padrão: hoje)
 * @returns Número de dias de diferença
 * @example
 * diffInDays(new Date('2026-01-31'), new Date('2026-01-01')) // 30
 */
export function diffInDays(
  date1: Date | string | number,
  date2: Date | string | number = new Date(),
): number {
  return moment(date1).diff(moment(date2), 'days');
}

/**
 * Adiciona dias a uma data
 * @param date - Data base
 * @param days - Número de dias a adicionar
 * @returns Nova data
 * @example
 * addDays(new Date('2026-01-31'), 5) // 2026-02-05
 */
export function addDays(date: Date | string | number, days: number): Date {
  return moment(date).add(days, 'days').toDate();
}

/**
 * Subtrai dias de uma data
 * @param date - Data base
 * @param days - Número de dias a subtrair
 * @returns Nova data
 * @example
 * subtractDays(new Date('2026-01-31'), 5) // 2026-01-26
 */
export function subtractDays(date: Date | string | number, days: number): Date {
  return moment(date).subtract(days, 'days').toDate();
}

/**
 * Retorna o início do dia
 * @param date - Data base
 * @returns Data com hora 00:00:00
 * @example
 * startOfDay(new Date('2026-01-31T14:30:00')) // 2026-01-31T00:00:00
 */
export function startOfDay(date: Date | string | number): Date {
  return moment(date).startOf('day').toDate();
}

/**
 * Retorna o fim do dia
 * @param date - Data base
 * @returns Data com hora 23:59:59
 * @example
 * endOfDay(new Date('2026-01-31T14:30:00')) // 2026-01-31T23:59:59
 */
export function endOfDay(date: Date | string | number): Date {
  return moment(date).endOf('day').toDate();
}
