import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Account, Transaction, Category, Budget } from '../types/finance';

interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
}

type FinanceAction =
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string };

const initialState: FinanceState = {
  accounts: [
    {
      id: '1',
      name: 'Compte Courant',
      type: 'checking',
      balance: 2500.00,
      institution: 'Banque Populaire',
      accountNumber: '****1234',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Livret A',
      type: 'savings',
      balance: 15000.00,
      institution: 'Banque Populaire',
      accountNumber: '****5678',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Carte Crédit',
      type: 'credit',
      balance: -850.00,
      institution: 'Crédit Agricole',
      accountNumber: '****9012',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  transactions: [
    {
      id: '1',
      accountId: '1',
      date: new Date(),
      description: 'Salaire',
      amount: 3200.00,
      category: 'Revenus',
      type: 'income',
      reconciled: false,
    },
    {
      id: '2',
      accountId: '1',
      date: new Date(),
      description: 'Courses Carrefour',
      amount: -85.50,
      category: 'Alimentation',
      type: 'expense',
      reconciled: true,
    },
    {
      id: '3',
      accountId: '1',
      date: new Date(),
      description: 'Facture EDF',
      amount: -120.00,
      category: 'Énergie',
      type: 'expense',
      reconciled: false,
    },
  ],
  categories: [
    { id: '1', name: 'Revenus', type: 'income', color: '#059669' },
    { id: '2', name: 'Alimentation', type: 'expense', color: '#DC2626' },
    { id: '3', name: 'Transport', type: 'expense', color: '#7C3AED' },
    { id: '4', name: 'Énergie', type: 'expense', color: '#EA580C' },
    { id: '5', name: 'Loisirs', type: 'expense', color: '#2563EB' },
  ],
  budgets: [
    {
      id: '1',
      categoryId: '2',
      name: 'Budget Alimentation',
      amount: 400.00,
      spent: 285.50,
      period: 'monthly',
      startDate: new Date(),
      endDate: new Date(),
    },
    {
      id: '2',
      categoryId: '3',
      name: 'Budget Transport',
      amount: 200.00,
      spent: 145.00,
      period: 'monthly',
      startDate: new Date(),
      endDate: new Date(),
    },
  ],
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id ? action.payload : account
        ),
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload),
      };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload),
      };
    default:
      return state;
  }
};

const FinanceContext = createContext<{
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
} | null>(null);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    financeReducer,
    initialState,
    (init) => {
      const stored = localStorage.getItem('financeState');
      if (!stored) return init;
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          accounts: parsed.accounts.map((a: any) => ({
            ...a,
            createdAt: new Date(a.createdAt),
            updatedAt: new Date(a.updatedAt),
          })),
          transactions: parsed.transactions.map((t: any) => ({
            ...t,
            date: new Date(t.date),
          })),
          budgets: parsed.budgets.map((b: any) => ({
            ...b,
            startDate: new Date(b.startDate),
            endDate: new Date(b.endDate),
          })),
        } as FinanceState;
      } catch {
        return init;
      }
    }
  );

  useEffect(() => {
    localStorage.setItem('financeState', JSON.stringify(state));
  }, [state]);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
