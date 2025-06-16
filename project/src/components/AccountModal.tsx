import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';
import { Account } from '../types/finance';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId?: string | null;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, accountId }) => {
  const { state, dispatch } = useFinance();
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking' as Account['type'],
    balance: 0,
    institution: '',
    accountNumber: '',
  });

  useEffect(() => {
    if (accountId) {
      const account = state.accounts.find(a => a.id === accountId);
      if (account) {
        setFormData({
          name: account.name,
          type: account.type,
          balance: account.balance,
          institution: account.institution,
          accountNumber: account.accountNumber,
        });
      }
    } else {
      setFormData({
        name: '',
        type: 'checking',
        balance: 0,
        institution: '',
        accountNumber: '',
      });
    }
  }, [accountId, state.accounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const accountData: Account = {
      id: accountId || Date.now().toString(),
      ...formData,
      createdAt: accountId ? state.accounts.find(a => a.id === accountId)?.createdAt || new Date() : new Date(),
      updatedAt: new Date(),
    };

    if (accountId) {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: accountData });
    } else {
      dispatch({ type: 'ADD_ACCOUNT', payload: accountData });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {accountId ? 'Modifier le compte' : 'Nouveau compte'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom du compte
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type de compte
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="checking">Compte Courant</option>
                <option value="savings">Épargne</option>
                <option value="credit">Crédit</option>
                <option value="investment">Investissement</option>
              </select>
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Institution bancaire
              </label>
              <input
                type="text"
                id="institution"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                Numéro de compte
              </label>
              <input
                type="text"
                id="accountNumber"
                required
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
                Solde initial (€)
              </label>
              <input
                type="number"
                id="balance"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {accountId ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
