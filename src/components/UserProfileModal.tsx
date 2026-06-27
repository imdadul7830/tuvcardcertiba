import React, { useState } from 'react';
import { X, DollarSign, Plus, Minus, User, History, CheckCircle, Clock } from 'lucide-react';
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

interface UserProfileModalProps {
  user: AppUser;
  trainees: Trainee[];
  invoices: Invoice[];
  onClose: () => void;
  onRefresh: () => void;
}

export default function UserProfileModal({ user, trainees, invoices, onClose, onRefresh }: UserProfileModalProps) {
  const [amount, setAmount] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || '',
    iqamaNumber: user.iqamaNumber || '',
    companyName: user.companyName || '',
    companyCrNumber: user.companyCrNumber || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAdjustDue = async (type: 'credit' | 'debit') => {
    if (!amount || isNaN(Number(amount))) return alert('Please enter a valid amount');
    
    setIsAdjusting(true);
    try {
      const res = await fetch(`/api/users/${user.id}/adjust-due`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), type })
      });
      const data = await res.json();
      if (data.success) {
        alert(type === 'debit' ? 'Due debited (increased) successfully' : 'Due credited (decreased) successfully');
        setAmount('');
        onRefresh();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Error adjusting due');
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        onRefresh();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Error saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">@{user.username} • {user.role === 'admin' ? 'Administrator' : 'User'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column (Info + Finances) */}
            <div className="md:col-span-1 space-y-6">
              {/* User Profile Edit */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile Info
                  </h3>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                  ) : (
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700 text-xs font-medium">Cancel</button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    </div>
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
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                      <input type="text" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Company Name</label>
                      <input type="text" value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Company CR Number</label>
                      <input type="text" value={editForm.companyCrNumber} onChange={e => setEditForm({...editForm, companyCrNumber: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Iqama Number</label>
                      <input type="text" value={editForm.iqamaNumber} onChange={e => setEditForm({...editForm, iqamaNumber: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full mt-2 bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                )}
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
                
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <h4 className="font-medium text-gray-900 text-sm">Adjust Balance</h4>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Amount" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAdjustDue('debit')}
                      disabled={isAdjusting || !amount}
                      className="flex-1 bg-orange-50 text-orange-700 border border-orange-200 font-medium py-2 rounded-md text-sm flex items-center justify-center gap-1 hover:bg-orange-100 disabled:opacity-50"
                      title="Increase user's due amount (charge)"
                    >
                      <Plus className="w-4 h-4" /> Debit
                    </button>
                    <button 
                      onClick={() => handleAdjustDue('credit')}
                      disabled={isAdjusting || !amount}
                      className="flex-1 bg-green-50 text-green-700 border border-green-200 font-medium py-2 rounded-md text-sm flex items-center justify-center gap-1 hover:bg-green-100 disabled:opacity-50"
                      title="Decrease user's due amount (payment)"
                    >
                      <Minus className="w-4 h-4" /> Credit
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Debit increases the due (adds an invoice). Credit decreases the due (marks payment).
                  </p>
                </div>
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
                <h3 className="text-base font-bold text-gray-900 mb-4">Recent Invoices</h3>
                <div className="max-h-[200px] overflow-y-auto pr-2">
                  {invoices.length > 0 ? (
                    <ul className="space-y-3">
                      {invoices.slice(0, 10).map(inv => (
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
                    <p className="text-sm text-gray-500 text-center py-4">No invoices found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
