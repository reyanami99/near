import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { formatCurrency } from '../utils/currency';
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';

export const Reports: React.FC = () => {
  const { state } = useFinance();
  const { transactions, categories } = state;
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Prepare data for charts
  const expensesByCategory = categories
    .filter(c => c.type === 'expense')
    .map(category => {
      const amount = transactions
        .filter(t => t.category === category.name && t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return {
        name: category.name,
        amount,
        color: category.color,
      };
    })
    .filter(item => item.amount > 0);

  const incomeByCategory = categories
    .filter(c => c.type === 'income')
    .map(category => {
      const amount = transactions
        .filter(t => t.category === category.name && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: category.name,
        amount,
        color: category.color,
      };
    })
    .filter(item => item.amount > 0);

  // Monthly trends
  const monthlyData = transactions.reduce((acc: any, transaction) => {
    const monthKey = transaction.date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };
    }
    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount;
    } else if (transaction.type === 'expense') {
      acc[monthKey].expenses += Math.abs(transaction.amount);
    }
    return acc;
  }, {});

  const monthlyTrends = Object.values(monthlyData).slice(-6); // Last 6 months

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netIncome = totalIncome - totalExpenses;

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Description', 'Catégorie', 'Montant', 'Type'],
      ...transactions.map(t => [
        t.date.toLocaleDateString('fr-FR'),
        t.description,
        t.category,
        t.amount,
        t.type
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports & Analyses</h1>
          <p className="text-gray-600 mt-1">Analysez vos finances avec des graphiques détaillés</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dépenses Totales</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solde Net</p>
              <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netIncome)}
              </p>
            </div>
            <div className={`p-2 rounded-full ${netIncome >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {netIncome >= 0 ? 
                <TrendingUp className="h-6 w-6 text-green-600" /> : 
                <TrendingDown className="h-6 w-6 text-red-600" />
              }
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expenses by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dépenses par Catégorie</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenus par Catégorie</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution Mensuelle</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Line type="monotone" dataKey="income" stroke="#059669" strokeWidth={2} name="Revenus" />
              <Line type="monotone" dataKey="expenses" stroke="#DC2626" strokeWidth={2} name="Dépenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Détail des Catégories</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Dépenses</h3>
              <div className="space-y-3">
                {expensesByCategory.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((category.amount / totalExpenses) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Revenus</h3>
              <div className="space-y-3">
                {incomeByCategory.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((category.amount / totalIncome) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
