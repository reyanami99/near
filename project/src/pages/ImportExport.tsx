import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Upload, Download, FileText, AlertCircle, Check } from 'lucide-react';

export const ImportExport: React.FC = () => {
  const { state, dispatch } = useFinance();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.csv')) {
          handleCSVImport(content);
        } else if (file.name.endsWith('.json')) {
          handleJSONImport(content);
        } else {
          throw new Error('Format de fichier non supporté');
        }
      } catch (error) {
        setImportStatus('error');
        setImportMessage('Erreur lors de l\'importation: ' + (error as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const handleCSVImport = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    if (!headers.includes('date') || !headers.includes('description') || !headers.includes('amount')) {
      throw new Error('Le fichier CSV doit contenir au minimum les colonnes: date, description, amount');
    }

    const transactions = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const transaction: any = {};
      
      headers.forEach((header, i) => {
        transaction[header] = values[i];
      });

      return {
        id: Date.now().toString() + index,
        accountId: state.accounts[0]?.id || '1',
        date: new Date(transaction.date),
        description: transaction.description,
        amount: parseFloat(transaction.amount),
        category: transaction.category || 'Divers',
        type: parseFloat(transaction.amount) >= 0 ? 'income' : 'expense',
        reconciled: false,
      };
    });

    transactions.forEach(transaction => {
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    });

    setImportStatus('success');
    setImportMessage(`${transactions.length} transactions importées avec succès`);
  };

  const handleJSONImport = (content: string) => {
    const data = JSON.parse(content);
    
    if (data.transactions) {
      data.transactions.forEach((transaction: any) => {
        dispatch({ 
          type: 'ADD_TRANSACTION', 
          payload: {
            ...transaction,
            id: Date.now().toString() + Math.random(),
            date: new Date(transaction.date),
          }
        });
      });
    }

    if (data.accounts) {
      data.accounts.forEach((account: any) => {
        dispatch({ 
          type: 'ADD_ACCOUNT', 
          payload: {
            ...account,
            id: Date.now().toString() + Math.random(),
            createdAt: new Date(account.createdAt),
            updatedAt: new Date(account.updatedAt),
          }
        });
      });
    }

    setImportStatus('success');
    setImportMessage('Données importées avec succès');
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'Description', 'Catégorie', 'Montant', 'Type', 'Compte'],
      ...state.transactions.map(t => [
        t.date.toLocaleDateString('fr-FR'),
        t.description,
        t.category,
        t.amount,
        t.type,
        state.accounts.find(a => a.id === t.accountId)?.name || 'Inconnu'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `near-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = {
      accounts: state.accounts,
      transactions: state.transactions,
      categories: state.categories,
      budgets: state.budgets,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `near-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import / Export</h1>
        <p className="text-gray-600 mt-1">Importez et exportez vos données financières</p>
      </div>

      {/* Import Status */}
      {importStatus !== 'idle' && (
        <div className={`p-4 rounded-md ${
          importStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            {importStatus === 'success' ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400" />
            )}
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                importStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {importMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Import Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Importer des Données
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier à importer
              </label>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-2">
                Formats supportés: CSV, JSON
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Format CSV attendu:</h4>
              <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded border">
                date,description,amount,category,type<br/>
                2024-01-15,Courses,-85.50,Alimentation,expense<br/>
                2024-01-15,Salaire,3200.00,Revenus,income
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Conseils d'importation</h4>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Utilisez le format de date DD/MM/YYYY ou YYYY-MM-DD</li>
                    <li>• Les montants négatifs sont considérés comme des dépenses</li>
                    <li>• Les montants positifs sont considérés comme des revenus</li>
                    <li>• Assurez-vous que les colonnes required sont présentes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Exporter des Données
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Exportez vos données pour les sauvegarder ou les utiliser dans d'autres applications.
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Export CSV</p>
                    <p className="text-xs text-gray-500">Transactions au format CSV</p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </button>

              <button
                onClick={handleExportJSON}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Sauvegarde Complète</p>
                    <p className="text-xs text-gray-500">Toutes les données au format JSON</p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Statistiques:</h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">{state.accounts.length}</span> comptes
                </div>
                <div>
                  <span className="font-medium">{state.transactions.length}</span> transactions
                </div>
                <div>
                  <span className="font-medium">{state.categories.length}</span> catégories
                </div>
                <div>
                  <span className="font-medium">{state.budgets.length}</span> budgets
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OFX Support Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Support des Formats Bancaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Formats Supportés</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• CSV (Comma Separated Values)</li>
              <li>• JSON (JavaScript Object Notation)</li>
              <li>• OFX (Open Financial Exchange) - Bientôt disponible</li>
              <li>• QIF (Quicken Interchange Format) - Bientôt disponible</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Banques Compatibles</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Toutes les banques exportant en CSV</li>
              <li>• Banques supportant l'export OFX</li>
              <li>• Applications financières tierces</li>
              <li>• Fichiers Excel convertis en CSV</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
