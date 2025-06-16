import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';
import { Budget } from '../types/finance';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId?: string | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, budgetId }) => {
  const { state, dispatch } = useFinance();
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    amount: 0,
    period: 'monthly' as Budget['period'],
  });

  useEffect(() => {
    if (budgetId) {
      const budget = state.budgets.find(b => b.id === budgetId);
      if (budget) {
        setFormData({
          name: budget.name,
          categoryId: budget.categoryId,
          amount: budget.amount,
          period: budget.period,
        });
      }
    } else {
      setFormData({
        name: '',
        categoryId: '',
        amount: 0,
        period: 'monthly',
      });
    }
  }, [budgetId, state.budgets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetData: Budget = {
      id: budgetId || Date.now().toString(),
      ...formData,
      spent: budgetId ? state.budgets.find(b => b.id === budgetId)?.spent || 0 : 0,
      startDate: new Date(),
      endDate: new Date(),
    };

    if (budgetId) {
      dispatch({ type: 'UPDATE_BUDGET', payload: budgetData });
    } else {
      dispatch({ type: 'ADD_BUDGET', payload: budgetData });
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
              {budgetId ? 'Modifier le budget' : 'Nouveau budget'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom du budget
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
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                id="categoryId"
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                {state.categories.filter(c => c.type === 'expense').map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
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
              <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                Période
              </label>
              <select
                id="period"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value as Budget['period'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
              </select>
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
                {budgetId ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
