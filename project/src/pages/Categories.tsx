import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { CategoryModal } from '../components/CategoryModal';

export const Categories: React.FC = () => {
  const { state, dispatch } = useFinance();
  const { categories } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleEditCategory = (categoryId: string) => {
    setEditingCategory(categoryId);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    }
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-600 mt-1">Organisez vos revenus et dépenses par catégorie</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Categories */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-green-800 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Revenus ({incomeCategories.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {incomeCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-green-800">{category.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCategory(category.id)}
                      className="text-green-600 hover:text-green-800 p-1 rounded"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {incomeCategories.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  Aucune catégorie de revenus
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-red-800 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Dépenses ({expenseCategories.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {expenseCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-red-800">{category.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCategory(category.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {expenseCategories.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  Aucune catégorie de dépenses
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        categoryId={editingCategory}
      />
    </div>
  );
};
