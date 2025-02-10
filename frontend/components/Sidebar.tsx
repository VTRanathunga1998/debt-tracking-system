"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/dashboard' },
    { name: 'Borrowers', icon: UsersIcon, href: '/borrowers' },
    { name: 'Loans', icon: CurrencyDollarIcon, href: '/loans' },
    { name: 'Reports', icon: DocumentTextIcon, href: '/reports' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 text-gray-700 hover:bg-gray-100 rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-xl transition duration-300 ease-in-out 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center mb-8 p-2">
            <CurrencyDollarIcon className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">DebtTracker</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center p-3 rounded-lg transition-colors
                  ${pathname === item.href
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t pt-4">
            <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <ArrowLeftOnRectangleIcon className="h-5 w-5 ml-auto text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}