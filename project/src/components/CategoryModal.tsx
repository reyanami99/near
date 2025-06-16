import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';
import { Category } from '../types/finance';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string | null;
}

const colorOptions = [
  '#059669', // green
  '#DC2626', // red
  '#2563EB', // blue
  '#7C3AED', // purple
  '#EA580C', // orange
  '#0891B2', // cyan
  '#BE185D', // pink
  '#65A30D', // lime
  '#B45309', // amber
  '#6B7280', // gray
];

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, categoryId }) => {
  const { state, dispatch } = useFinance();
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as Category['type'],
    color: colorOptions[0],
  });

  useEffect(() => {
    if (categoryId) {
      const category = state.categories.find(c => c.id === categoryId);
      if (category) {
        setFormData({
          name: category.name,
          type: category.type,
          color: category.color,
        });
      }
    } else {
      setFormData({
        name: '',
        type: 'expense',
        color: colorOptions[0],
      });
    }
  }, [categoryId, state.categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData: Category = {
      id: categoryId || Date.now().toString(),
      ...formData,
    };

    if (categoryId) {
      dispatch({ type: 'UPDATE_CATEGORY', payload: categoryData });
    } else {
      dispatch({ type: 'ADD_CATEGORY', payload: categoryData });
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
              {categoryId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom de la catégorie
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
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Category['type'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="expense">Dépense</option>
                <option value="income">Revenu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-full border-2 ${
                      formData.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
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
                {categoryId ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
