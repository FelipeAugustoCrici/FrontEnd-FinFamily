export type CreditCard = {
  id: string;
  familyId?: string;
  ownerId?: string;
  owner?: { id: string; name: string };
  name: string;
  bank?: string;
  brand?: string;
  color?: string;
  limitAmount: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  isActive: boolean;
  createdAt: string;
  invoices?: CreditCardInvoice[];
};

export type CreditCardInvoice = {
  id: string;
  creditCardId: string;
  creditCard?: CreditCard;
  referenceMonth: number;
  referenceYear: number;
  closingDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'open' | 'closed' | 'paid' | 'overdue';
  installments?: CreditCardInstallment[];
  createdAt: string;
};

export type CreditCardPurchase = {
  id: string;
  creditCardId: string;
  familyId?: string;
  ownerId?: string;
  owner?: { id: string; name: string };
  categoryId?: string;
  category?: { id: string; name: string };
  description: string;
  purchaseDate: string;
  totalAmount: number;
  installments: number;
  observation?: string;
  parcels?: CreditCardInstallment[];
  createdAt: string;
};

export type CreditCardInstallment = {
  id: string;
  purchaseId: string;
  purchase?: CreditCardPurchase;
  invoiceId: string;
  invoice?: CreditCardInvoice;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  referenceMonth: number;
  referenceYear: number;
  status: 'pending' | 'paid';
};

export type CreateCreditCardDTO = {
  familyId?: string;
  ownerId?: string;
  name: string;
  bank?: string;
  brand?: string;
  color?: string;
  limitAmount: number;
  closingDay: number;
  dueDay: number;
};

export type CreatePurchaseDTO = {
  creditCardId: string;
  familyId?: string;
  ownerId?: string;
  categoryId?: string;
  description: string;
  purchaseDate: string;
  totalAmount: number;
  installments: number;
  observation?: string;
};

export const CARD_BRANDS = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'elo', label: 'Elo' },
  { value: 'amex', label: 'American Express' },
  { value: 'hipercard', label: 'Hipercard' },
  { value: 'other', label: 'Outra' },
] as const;

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  open: 'Aberta',
  closed: 'Fechada',
  paid: 'Paga',
  overdue: 'Vencida',
};

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  closed: 'bg-primary-100 text-primary-700',
  paid: 'bg-success-50 text-success-700',
  overdue: 'bg-danger-50 text-danger-700',
};
