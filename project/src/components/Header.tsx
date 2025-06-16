import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, Tag, PieChart, BarChart3, Upload, Wallet, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Comptes', href: '/accounts', icon: CreditCard },
    { name: 'Catégories', href: '/categories', icon: Tag },
    { name: 'Budget', href: '/budget', icon: Wallet },
    { name: 'Rapports', href: '/reports', icon: BarChart3 },
    { name: 'Import/Export', href: '/import-export', icon: Upload },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <PieChart className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Near</span>
            </Link>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <nav
            className={`${mobileOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 mt-4 md:mt-0`}
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Nouveau
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
