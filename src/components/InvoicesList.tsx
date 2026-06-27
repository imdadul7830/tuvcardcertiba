import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clock, AlertCircle, Mail } from 'lucide-react';

interface Invoice {
  id: string;
  userId: string;
  username?: string;
  amount: number;
  status: string;
  createdAt: number;
}

interface InvoicesListProps {
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  onPayInvoice: (id: string) => void;
  onMarkOverdue: (id: string) => void;
}

export default function InvoicesList({ invoices, setInvoices, onPayInvoice, onMarkOverdue }: InvoicesListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  
  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  const handleMarkOverdue = async (id: string) => {
    setSendingReminder(id);
    await onMarkOverdue(id);
    setSendingReminder(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Generated Invoices</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('pending')} 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'pending' ? 'bg-slate-800 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('overdue')} 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'overdue' ? 'bg-slate-800 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
          >
            Overdue
          </button>
          <button 
            onClick={() => setFilter('paid')} 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'paid' ? 'bg-slate-800 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
          >
            Paid
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Generated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{inv.amount} SAR</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(inv.createdAt), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {inv.status === 'paid' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3" /> Paid
                    </span>
                  ) : inv.status === 'overdue' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3" /> Overdue
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {inv.status !== 'paid' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleMarkOverdue(inv.id)}
                        disabled={sendingReminder === inv.id}
                        className="text-orange-600 hover:text-orange-900 bg-orange-50 px-3 py-1 rounded border border-orange-200 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Mail className="w-3 h-3" /> {sendingReminder === inv.id ? 'Sending...' : (inv.status === 'overdue' ? 'Send Reminder' : 'Mark Overdue')}
                      </button>
                      <button 
                        onClick={() => onPayInvoice(inv.id)}
                        className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded border border-green-200"
                      >
                        Mark Paid
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
