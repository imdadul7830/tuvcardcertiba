import React from 'react';
import { DollarSign, User, History, CheckCircle, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Trainee {
  id: string;
  name: string;
  iqama?: string;
  phone?: string;
  createdAt?: number;
}

interface Invoice {
  id: string;
  amount: number;
  status: string;
  createdAt: number;
}

interface AppUser {
  id: string;
  username: string;
  name: string;
  role?: string;
  due?: number;
  iqamaNumber?: string;
  companyName?: string;
  companyCrNumber?: string;
}

interface UserProfileProps {
  user: AppUser;
  trainees: Trainee[];
  invoices: Invoice[];
  onViewInvoice?: (user: AppUser) => void;
}

export default function UserProfile({ user, trainees, invoices, onViewInvoice }: UserProfileProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <span className="text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">@{user.username} • {user.role === 'admin' ? 'Administrator' : 'User'}</p>
          </div>
        </div>
      </div>

      <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 rounded-b-xl border border-t-0 border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (Info + Finances) */}
          <div className="md:col-span-1 space-y-6">
            
            {/* User Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Profile Info
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Company Name</p>
                  <p className="text-sm font-medium text-gray-900">{user.companyName || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Company CR Number</p>
                  <p className="text-sm font-medium text-gray-900">{user.companyCrNumber || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Iqama Number</p>
                  <p className="text-sm font-medium text-gray-900">{user.iqamaNumber || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Current Balance
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-[#002f6c]">{user.due || 0} SAR</span>
                <p className="text-xs text-gray-500 mt-1">Total outstanding due</p>
              </div>
              {onViewInvoice && (
                <div className="border-t border-gray-100 pt-4">
                  <button 
                    onClick={() => onViewInvoice(user)}
                    className="w-full bg-white border border-[#002f6c] text-[#002f6c] hover:bg-blue-50 py-2 px-4 rounded-md text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <FileText size={16} /> View Billing Invoice
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Trainees & Activity */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" /> Trainees Added ({trainees.length})
              </h3>
              <div className="max-h-[300px] overflow-y-auto pr-2">
                {trainees.length > 0 ? (
                  <ul className="space-y-3">
                    {trainees.map(t => (
                      <li key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.iqama || t.phone || 'No ID'}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {t.createdAt ? format(new Date(t.createdAt), 'MMM dd, yyyy') : 'Unknown Date'}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No trainees added yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-4">Transaction History</h3>
              <div className="max-h-[200px] overflow-y-auto pr-2">
                {invoices.length > 0 ? (
                  <ul className="space-y-3">
                    {invoices.map(inv => (
                      <li key={inv.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{inv.id}</p>
                          <p className="text-xs text-gray-500">{format(new Date(inv.createdAt), 'MMM dd, yyyy')}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">{inv.amount} SAR</span>
                          {inv.status === 'paid' ? (
                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                               <CheckCircle className="w-3 h-3" /> Paid
                             </span>
                           ) : inv.status === 'overdue' ? (
                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                               Overdue
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                               <Clock className="w-3 h-3" /> Pending
                             </span>
                           )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No transactions found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
