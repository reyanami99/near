import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { CreditCard, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { AccountModal } from '../components/AccountModal';

export const Accounts: React.FC = () => {
  const { state, dispatch } = useFinance();
  const { accounts } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);

  const handleEditAccount = (accountId: string) => {
    setEditingAccount(accountId);
    setIsModalOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: accountId });
    }
  };

  const getAccountTypeLabel = (type: string) => {
    const types = {
      checking: 'Compte Courant',
      savings: 'Épargne',
      credit: 'Crédit',
      investment: 'Investissement'
    };
    return types[type as keyof typeof types] || type;
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      checking: 'bg-blue-100 text-blue-800',
      savings: 'bg-green-100 text-green-800',
      credit: 'bg-red-100 text-red-800',
      investment: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Comptes</h1>
          <p className="text-gray-600 mt-1">Gérez vos comptes bancaires et leurs transactions</p>
        </div>
        <button
          onClick={() => {
            setEditingAccount(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau Compte</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Liste des Comptes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-500">
                          Créé le {account.createdAt.toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(account.type)}`}>
                      {getAccountTypeLabel(account.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.accountNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(account.balance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link
                        to={`/account/${account.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Voir les transactions"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleEditAccount(account.id)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Comptes Courants</h3>
          <p className="text-2xl font-bold text-blue-900">
            {accounts.filter(a => a.type === 'checking').length}
          </p>
          <p className="text-sm text-blue-600">
            {formatCurrency(accounts.filter(a => a.type === 'checking').reduce((sum, a) => sum + a.balance, 0))}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-800 mb-2">Épargne</h3>
          <p className="text-2xl font-bold text-green-900">
            {accounts.filter(a => a.type === 'savings').length}
          </p>
          <p className="text-sm text-green-600">
            {formatCurrency(accounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0))}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <h3 className="text-sm font-medium text-red-800 mb-2">Crédit</h3>
          <p className="text-2xl font-bold text-red-900">
            {accounts.filter(a => a.type === 'credit').length}
          </p>
          <p className="text-sm text-red-600">
            {formatCurrency(accounts.filter(a => a.type === 'credit').reduce((sum, a) => sum + a.balance, 0))}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Investissements</h3>
          <p className="text-2xl font-bold text-purple-900">
            {accounts.filter(a => a.type === 'investment').length}
          </p>
          <p className="text-sm text-purple-600">
            {formatCurrency(accounts.filter(a => a.type === 'investment').reduce((sum, a) => sum + a.balance, 0))}
          </p>
        </div>
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        accountId={editingAccount}
      />
    </div>
  );
};
