import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Edit, Trash2, Wallet, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { BudgetModal } from '../components/BudgetModal';

export const Budget: React.FC = () => {
  const { state, dispatch } = useFinance();
  const { budgets, categories } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);

  const handleEditBudget = (budgetId: string) => {
    setEditingBudget(budgetId);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = (budgetId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      dispatch({ type: 'DELETE_BUDGET', payload: budgetId });
    }
  };

  const getBudgetProgress = (budget: any) => {
    const percentage = (budget.spent / budget.amount) * 100;
    return Math.min(percentage, 100);
  };

  const getBudgetStatus = (budget: any) => {
    const percentage = (budget.spent / budget.amount) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overBudgetCount = budgets.filter(budget => budget.spent > budget.amount).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600 mt-1">Planifiez et suivez vos dépenses par catégorie</p>
        </div>
        <button
          onClick={() => {
            setEditingBudget(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau Budget</span>
        </button>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Total</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBudget)}</p>
            </div>
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Dépensé</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="text-orange-600">
              <div className="text-sm font-medium">
                {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budgets Dépassés</p>
              <p className="text-2xl font-bold text-red-600">{overBudgetCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Budget List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mes Budgets</h2>
        </div>
        <div className="p-6">
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun budget configuré</p>
              <p className="text-gray-400 text-sm mt-2">
                Créez votre premier budget pour commencer à suivre vos dépenses
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {budgets.map((budget) => {
                const category = categories.find(c => c.id === budget.categoryId);
                const progress = getBudgetProgress(budget);
                const status = getBudgetStatus(budget);
                
                return (
                  <div key={budget.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {category && (
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{budget.name}</h3>
                          <p className="text-sm text-gray-500">
                            {category?.name} • {budget.period === 'monthly' ? 'Mensuel' : 
                             budget.period === 'weekly' ? 'Hebdomadaire' : 'Annuel'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBudget(budget.id)}
                          className="text-gray-600 hover:text-gray-900 p-2 rounded"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dépensé</span>
                        <span className="font-medium">
                          {formatCurrency(budget.spent)} sur {formatCurrency(budget.amount)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${getStatusColor(status)}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round(progress)}% utilisé</span>
                        <span>
                          {budget.amount - budget.spent > 0 
                            ? `${formatCurrency(budget.amount - budget.spent)} restant`
                            : `${formatCurrency(budget.spent - budget.amount)} dépassé`}
                        </span>
                      </div>
                    </div>

                    {status === 'over' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-700">
                            Budget dépassé de {formatCurrency(budget.spent - budget.amount)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        budgetId={editingBudget}
      />
    </div>
  );
};
