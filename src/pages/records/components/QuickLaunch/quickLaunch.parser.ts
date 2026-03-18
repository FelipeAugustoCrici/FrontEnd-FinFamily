import moment from 'moment';

export type QuickLaunchType = 'expense' | 'income' | 'salary';

export interface ParsedLaunch {
  description: string;
  amount: number | null;
  date: string;
  type: QuickLaunchType;
  categoryHint: string | null;
  personHint: string | null;
  confidence: number;
  missingFields: string[];
}

function localDate(offsetDays = 0): string {
  return moment().add(offsetDays, 'days').format('YYYY-MM-DD');
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const DATE_WORDS: Record<string, number> = {
  hoje: 0,
  ontem: -1,
  amanha: 1,
};

const INCOME_KEYWORDS = [
  'salario', 'salary', 'bonus', 'extra', 'renda', 'recebimento',
  'freelance', 'dividendo', 'rendimento', 'reembolso', 'comissao',
];

const CATEGORY_MAP: Record<string, string> = {
  mercado: 'Alimentação',
  supermercado: 'Alimentação',
  ifood: 'Alimentação',
  restaurante: 'Alimentação',
  lanche: 'Alimentação',
  padaria: 'Alimentação',
  gasolina: 'Transporte',
  combustivel: 'Transporte',
  uber: 'Transporte',
  onibus: 'Transporte',
  metro: 'Transporte',
  aluguel: 'Moradia',
  condominio: 'Moradia',
  celesc: 'Moradia',
  copel: 'Moradia',
  cemig: 'Moradia',
  luz: 'Moradia',
  agua: 'Moradia',
  internet: 'Moradia',
  netflix: 'Lazer',
  spotify: 'Lazer',
  cinema: 'Lazer',
  academia: 'Saúde',
  farmacia: 'Saúde',
  medico: 'Saúde',
  plano: 'Saúde',
  petshop: 'Pet',
  pet: 'Pet',
  racao: 'Pet',
  escola: 'Educação',
  faculdade: 'Educação',
  curso: 'Educação',
  salario: 'Salário',
  bonus: 'Rendimentos',
  extra: 'Rendimentos',
};

export function parseQuickLaunch(
  text: string,
  familyMembers: { id: string; name: string }[] = [],
  categories: { id: string; name: string }[] = [],
): ParsedLaunch {
  const raw = text.trim();
  if (!raw) {
    return {
      description: '',
      amount: null,
      date: localDate(0),
      type: 'expense',
      categoryHint: null,
      personHint: null,
      confidence: 0,
      missingFields: ['description', 'amount'],
    };
  }

  const tokens = raw.split(/\s+/);
  const used = new Set<number>();

  let amount: number | null = null;
  for (let i = 0; i < tokens.length; i++) {
    if (!/^[\d.,]+$/.test(tokens[i])) continue;
    const n = parseFloat(tokens[i].replace(',', '.'));
    if (!isNaN(n) && n > 0) {
      amount = n;
      used.add(i);
      break;
    }
  }

  let date = localDate(0);
  for (let i = 0; i < tokens.length; i++) {
    const t = norm(tokens[i]);

    if (t in DATE_WORDS) {
      date = localDate(DATE_WORDS[t]);
      used.add(i);
      break;
    }

    if (t === 'dia' && i + 1 < tokens.length) {
      const day = parseInt(tokens[i + 1]);
      if (!isNaN(day) && day >= 1 && day <= 31) {
        date = moment().date(day).format('YYYY-MM-DD');
        used.add(i);
        used.add(i + 1);
        break;
      }
    }

    const dm = t.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
    if (dm) {
      date = moment().date(parseInt(dm[1])).month(parseInt(dm[2]) - 1).format('YYYY-MM-DD');
      used.add(i);
      break;
    }
  }

  const descIdx = tokens.findIndex((_, i) => !used.has(i));

  let personHint: string | null = null;
  for (let i = 0; i < tokens.length; i++) {
    if (used.has(i) || i === descIdx) continue;
    const t = norm(tokens[i]);
    const match = familyMembers.find((m) => norm(m.name).startsWith(t) && t.length >= 3);
    if (match) {
      personHint = match.id;
      used.add(i);
      break;
    }
  }

  let categoryHint: string | null = null;
  if (descIdx >= 0) {
    const t = norm(tokens[descIdx]);
    const mapped = CATEGORY_MAP[t];
    if (mapped) {
      const found = categories.find((c) => norm(c.name) === norm(mapped));
      categoryHint = found?.id ?? mapped;
    }
  }
  if (!categoryHint) {
    for (let i = 0; i < tokens.length; i++) {
      if (used.has(i) || i === descIdx) continue;
      const t = norm(tokens[i]);
      const direct = categories.find((c) => norm(c.name) === t);
      if (direct) { categoryHint = direct.id; used.add(i); break; }
      const mapped = CATEGORY_MAP[t];
      if (mapped) {
        const found = categories.find((c) => norm(c.name) === norm(mapped));
        categoryHint = found?.id ?? mapped;
        used.add(i);
        break;
      }
    }
  }

  const normRaw = norm(raw);
  let type: QuickLaunchType = 'expense';
  if (INCOME_KEYWORDS.some((kw) => normRaw.includes(kw))) {
    type = normRaw.includes('salario') ? 'salary' : 'income';
  }

  const descTokens = tokens.filter((_, i) => !used.has(i));
  const description = descTokens.length > 0 ? descTokens.join(' ').trim() : (tokens[0] ?? '');

  const missingFields: string[] = [];
  if (!description) missingFields.push('description');
  if (amount === null) missingFields.push('amount');

  let confidence = 0;
  if (description) confidence += 0.3;
  if (amount !== null) confidence += 0.4;
  if (categoryHint) confidence += 0.2;
  if (personHint) confidence += 0.1;

  return { description, amount, date, type, categoryHint, personHint, confidence, missingFields };
}

export function resolveCategoryName(
  hint: string | null,
  categories: { id: string; name: string }[],
): string | null {
  if (!hint) return null;
  return categories.find((c) => c.id === hint)?.name ?? hint;
}
