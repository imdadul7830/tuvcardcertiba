import React from 'react';
import { format } from 'date-fns';

interface InvoiceProps {
  user: {
    id: string;
    username: string;
    name: string;
    due?: number;
  };
  invoiceNumber: string;
}

export default function InvoiceView({ user, invoiceNumber }: InvoiceProps) {
  const currentDate = new Date();
  const dueDate = new Date(currentDate);
  dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days

  const quantity = Math.floor((user.due || 0) / 50);
  const unitPrice = 50;

  return (
    <div id="invoice-capture" className="bg-white p-8 max-w-4xl mx-auto font-sans text-gray-800" style={{ width: '800px', minHeight: '1122px' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-[#002f6c] pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-[#002f6c] tracking-tight mb-1">INVOICE</h1>
          <p className="text-gray-500 font-medium">#{invoiceNumber}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#002f6c] mb-1">CERTIVA TUV</div>
          <p className="text-sm text-gray-600">123 Business Avenue</p>
          <p className="text-sm text-gray-600">Tech District, Riyadh</p>
          <p className="text-sm text-gray-600">Saudi Arabia</p>
          <p className="text-sm text-gray-600 mt-1">info@certivatuv.com</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex justify-between mb-10">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
          <p className="text-lg font-bold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-600">User ID: {user.username}</p>
        </div>
        <div className="text-right">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Issue</h3>
            <p className="font-semibold text-gray-900">{format(currentDate, 'MMMM dd, yyyy')}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date</h3>
            <p className="font-semibold text-gray-900">{format(dueDate, 'MMMM dd, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-4 text-sm font-bold text-gray-700">Description</th>
              <th className="py-3 px-4 text-sm font-bold text-gray-700 text-center">Quantity</th>
              <th className="py-3 px-4 text-sm font-bold text-gray-700 text-right">Unit Price</th>
              <th className="py-3 px-4 text-sm font-bold text-gray-700 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="border-b border-gray-200">
            <tr>
              <td className="py-4 px-4">
                <p className="font-bold text-gray-900">Certificate Generation Service</p>
                <p className="text-sm text-gray-500">ID card & profile creation for trainees</p>
              </td>
              <td className="py-4 px-4 text-center text-gray-700">{quantity > 0 ? quantity : 1}</td>
              <td className="py-4 px-4 text-right text-gray-700">{unitPrice} SAR</td>
              <td className="py-4 px-4 text-right font-bold text-gray-900">{user.due || 0} SAR</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-1/2">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{user.due || 0} SAR</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Tax (0%)</span>
            <span className="font-medium">0 SAR</span>
          </div>
          <div className="flex justify-between py-4 border-b-2 border-[#002f6c] mt-2">
            <span className="text-xl font-bold text-[#002f6c]">Total Due</span>
            <span className="text-xl font-black text-[#002f6c]">{user.due || 0} SAR</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-gray-200 text-center">
        <h4 className="font-bold text-gray-900 mb-2">Thank you for your business!</h4>
        <p className="text-sm text-gray-500">If you have any questions about this invoice, please contact support.</p>
        <p className="text-xs text-gray-400 mt-4">This is a computer generated document. No signature is required.</p>
      </div>
    </div>
  );
}
