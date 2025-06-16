import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';
import { Transaction } from '../types/finance';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  transactionId?: string | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  accountId, 
  transactionId 
}) => {
  const { state, dispatch } = useFinance();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: '',
    type: 'expense' as Transaction['type'],
    notes: '',
    reconciled: false,
  });

  useEffect(() => {
    if (transactionId) {
      const transaction = state.transactions.find(t => t.id === transactionId);
      if (transaction) {
        setFormData({
          date: transaction.date.toISOString().split('T')[0],
          description: transaction.description,
          amount: Math.abs(transaction.amount),
          category: transaction.category,
          type: transaction.type,
          notes: transaction.notes || '',
          reconciled: transaction.reconciled,
        });
      }
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        category: '',
        type: 'expense',
        notes: '',
        reconciled: false,
      });
    }
  }, [transactionId, state.transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData: Transaction = {
      id: transactionId || Date.now().toString(),
      accountId,
      date: new Date(formData.date),
      description: formData.description,
      amount: formData.type === 'expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount),
      category: formData.category,
      type: formData.type,
      notes: formData.notes,
      reconciled: formData.reconciled,
    };

    if (transactionId) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transactionData });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: transactionData });
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
              {transactionId ? 'Modifier la transaction' : 'Nouvelle transaction'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Transaction['type'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="expense">Dépense</option>
                <option value="income">Revenu</option>
                <option value="transfer">Virement</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Montant (€)
              </label>
              <input
                type="number"
                id="amount"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <input
                type="text"
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (optionnel)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="reconciled"
                checked={formData.reconciled}
                onChange={(e) => setFormData({ ...formData, reconciled: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="reconciled" className="ml-2 block text-sm text-gray-900">
                Transaction rapprochée
              </label>
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
                {transactionId ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
