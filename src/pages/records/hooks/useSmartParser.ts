/**
 * useSmartParser — interpreta texto livre e extrai descrição, valor, tipo e categoria sugerida.
 * Funciona em camadas: 1) padrões salvos pelo usuário (localStorage), 2) keywords globais.
 */

export interface ParsedRecord {
  description: string;
  value: string;
  type: 'expense' | 'salary' | 'income';
  suggestedCategoryName: string;
  confidence: 'high' | 'medium' | 'low';
}

// ─── Mapeamento global de keywords → categoria + tipo ───────────────────────
const KEYWORD_MAP: Array<{
  keywords: string[];
  category: string;
  type: 'expense' | 'salary' | 'income';
}> = [
  // Alimentação
  { keywords: ['ifood', 'rappi', 'uber eats', 'delivery', 'restaurante', 'lanche', 'pizza', 'hamburguer', 'mercado', 'supermercado', 'padaria', 'açougue', 'feira', 'hortifruti', 'refeição', 'almoço', 'jantar', 'café'], category: 'Alimentação', type: 'expense' },
  // Transporte
  { keywords: ['uber', '99', 'taxi', 'táxi', 'gasolina', 'combustível', 'etanol', 'diesel', 'estacionamento', 'pedágio', 'ônibus', 'metrô', 'trem', 'passagem', 'transporte'], category: 'Transporte', type: 'expense' },
  // Saúde
  { keywords: ['farmácia', 'remédio', 'medicamento', 'consulta', 'médico', 'dentista', 'exame', 'hospital', 'clínica', 'plano de saúde', 'academia', 'gym'], category: 'Saúde', type: 'expense' },
  // Moradia
  { keywords: ['aluguel', 'condomínio', 'iptu', 'água', 'luz', 'energia', 'gás', 'internet', 'telefone', 'celular', 'tv', 'streaming', 'netflix', 'spotify', 'amazon'], category: 'Moradia', type: 'expense' },
  // Educação
  { keywords: ['escola', 'faculdade', 'curso', 'livro', 'material escolar', 'mensalidade', 'educação', 'aula', 'treinamento'], category: 'Educação', type: 'expense' },
  // Lazer
  { keywords: ['cinema', 'teatro', 'show', 'viagem', 'hotel', 'passeio', 'lazer', 'diversão', 'jogo', 'game'], category: 'Lazer', type: 'expense' },
  // Vestuário
  { keywords: ['roupa', 'calçado', 'tênis', 'camisa', 'calça', 'vestido', 'loja', 'shopping', 'moda'], category: 'Vestuário', type: 'expense' },
  // Receita — Salário
  { keywords: ['salário', 'salario', 'pagamento', 'holerite', 'contracheque', 'remuneração'], category: 'Salário', type: 'salary' },
  // Receita — Extra
  { keywords: ['freelance', 'freela', 'bônus', 'bonus', 'comissão', 'extra', 'renda extra', 'dividendo', 'investimento', 'rendimento', 'aluguel recebido', 'ganhei', 'recebi'], category: 'Extra', type: 'income' },
];

const STORAGE_KEY = 'finfamily_smart_patterns';

// ─── Padrões do usuário (localStorage) ──────────────────────────────────────
function getUserPatterns(): Record<string, { category: string; type: 'expense' | 'salary' | 'income' }> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveUserPattern(keyword: string, category: string, type: 'expense' | 'salary' | 'income') {
  const patterns = getUserPatterns();
  patterns[keyword.toLowerCase().trim()] = { category, type };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
}

// ─── Extração de valor numérico ──────────────────────────────────────────────
function extractValue(text: string): string {
  // Captura o número mais longo: 1000, 1.500, 1500,50, 1.500,50
  // Ordena candidatos por comprimento para pegar o maior match
  const matches = [...text.matchAll(/\d+(?:[.,]\d+)*/g)];
  if (!matches.length) return '';
  // Pega o match mais longo (maior valor provável)
  const raw = matches.reduce((a, b) => (b[0].length > a[0].length ? b : a))[0];
  // Remove separador de milhar (ponto antes de 3 dígitos) e normaliza vírgula decimal
  const normalized = raw
    .replace(/\.(?=\d{3}(?!\d))/g, '') // remove ponto de milhar
    .replace(',', '.');                  // vírgula → ponto decimal
  const num = parseFloat(normalized);
  return isNaN(num) ? '' : num.toString();
}

// ─── Extração de descrição (remove o número) ────────────────────────────────
function extractDescription(text: string): string {
  return text
    .replace(/\b\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Parser principal ────────────────────────────────────────────────────────
export function parseSmartInput(text: string): ParsedRecord | null {
  if (!text || text.trim().length < 2) return null;

  const lower = text.toLowerCase().trim();
  const value = extractValue(text);
  const description = extractDescription(text) || text.trim();

  // 1) Padrões do usuário
  const userPatterns = getUserPatterns();
  for (const [keyword, data] of Object.entries(userPatterns)) {
    if (lower.includes(keyword)) {
      return { description, value, type: data.type, suggestedCategoryName: data.category, confidence: 'high' };
    }
  }

  // 2) Keywords globais
  for (const entry of KEYWORD_MAP) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        return { description, value, type: entry.type, suggestedCategoryName: entry.category, confidence: 'medium' };
      }
    }
  }

  // 3) Fallback: se tem valor, assume despesa sem categoria
  if (value) {
    return { description, value, type: 'expense', suggestedCategoryName: '', confidence: 'low' };
  }

  return null;
}
