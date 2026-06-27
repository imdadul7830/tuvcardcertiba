import React, { useState, useEffect } from 'react';
import { Bell, Send, Trash2, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Notice {
  id: string;
  title: string;
  message: string;
  userId: string | null;
  createdAt: number;
}

interface AppUser {
  id: string;
  username: string;
  name: string;
}

interface NoticesAdminProps {
  users: AppUser[];
}

export default function NoticesAdmin({ users }: NoticesAdminProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetUserId, setTargetUserId] = useState<string>(''); // empty means all users
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      setNotices(data);
    } catch (e) {
      console.error('Failed to fetch notices', e);
    }
  };

  const handleSendNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, userId: targetUserId || null })
      });
      const data = await res.json();
      if (data.success) {
        setNotices([...notices, data.notice]);
        setTitle('');
        setMessage('');
        setTargetUserId('');
        alert('Notice sent successfully');
      }
    } catch (e) {
      alert('Failed to send notice');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotices(notices.filter(n => n.id !== id));
      }
    } catch (e) {
      alert('Failed to delete notice');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Send Notice Form */}
      <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" /> Send Notice
        </h2>
        <form onSubmit={handleSendNotice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Target User</label>
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50"
            >
              <option value="">All Users</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} (@{u.username})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notice Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50"
              placeholder="E.g., System Update"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50"
              placeholder="Enter your message here..."
            />
          </div>
          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 font-medium disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSending ? 'Sending...' : 'Send Notice'}
          </button>
        </form>
      </div>

      {/* Notices List */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" /> Sent Notices
        </h2>
        {notices.length === 0 ? (
          <p className="text-gray-500">No notices found.</p>
        ) : (
          <div className="space-y-4">
            {notices.map(notice => (
              <div key={notice.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{notice.title}</h3>
                  <button onClick={() => handleDelete(notice.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{notice.message}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {notice.userId ? `To: ${users.find(u => u.id === notice.userId)?.name || 'Specific User'}` : 'To: All Users'}
                  </span>
                  <span>{format(new Date(notice.createdAt), 'MMM dd, yyyy h:mm a')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
