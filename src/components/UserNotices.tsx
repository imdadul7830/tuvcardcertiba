import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';

interface Notice {
  id: string;
  title: string;
  message: string;
  userId: string | null;
  createdAt: number;
}

interface UserNoticesProps {
  userId: string;
}

export default function UserNotices({ userId }: UserNoticesProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, [userId]);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`/api/notices?userId=${userId}`);
      const data = await res.json();
      setNotices(data);
    } catch (e) {
      console.error('Failed to fetch notices', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading notices...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">My Notices</h2>
      </div>

      {notices.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8" />
          </div>
          <p className="text-gray-500 font-medium">You don't have any notices yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map(notice => (
            <div key={notice.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
              {notice.userId && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                  Direct Message
                </div>
              )}
              <h3 className="font-bold text-lg text-gray-900 mb-2">{notice.title}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{notice.message}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                <span>Received:</span>
                <span>{format(new Date(notice.createdAt), 'MMM dd, yyyy h:mm a')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
