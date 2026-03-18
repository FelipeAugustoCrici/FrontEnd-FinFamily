import { CreditCardsList, CreditCardDetail, InvoiceDetail } from '../';

export const CreditCardRoutes = {
  creditCards: {
    path: '/credit-cards',
    element: <CreditCardsList />,
  },
  creditCardDetail: {
    path: '/credit-cards/:id',
    element: <CreditCardDetail />,
  },
  invoiceDetail: {
    path: '/credit-cards/invoices/:invoiceId',
    element: <InvoiceDetail />,
  },
};
