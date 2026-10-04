import React, { useState, useEffect } from 'react';
import { Bell, User, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedDepartment, user } = useAuth();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        let url = selectedDepartment ? `/api/notices?department=${selectedDepartment}` : '/api/notices?';
        if (user?.batchCode) {
          url += (url.includes('?') ? '&' : '?') + `batch=${user.batchCode}`;
        }
        const res = await axios.get(url);
        setNotices(res.data);
        // Mark as read when viewing
        await axios.post('/api/notices/mark-read');
        window.dispatchEvent(new Event('noticesRead'));
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [selectedDepartment, user?.batchCode]);

  const getThemeColor = () => {
    if (selectedDepartment === 'SUGEO') return 'text-emerald-500 bg-emerald-500/10';
    if (selectedDepartment === 'RS_GIS') return 'text-indigo-500 bg-indigo-500/10';
    return 'text-orange-500 bg-orange-500/10';
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full font-sans">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Notice Board</h1>
        <p className="text-neutral-400">
          Official announcements from the {selectedDepartment === 'SUGEO' ? 'Surveying & Geodesy' : 'Remote Sensing & GIS'} department.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-neutral-500 animate-pulse p-4 text-center">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="p-8 text-center bg-neutral-900/30 border border-neutral-800 rounded-2xl text-neutral-500">
            No active notices for your department right now.
          </div>
        ) : (
          notices.map(notice => (
            <div key={notice.id} className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-4 hover:border-neutral-700/80 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getThemeColor()} flex-shrink-0`}>
                  <Bell size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-200 leading-relaxed mb-3">
                    {notice.message}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-500">
                    <div className="flex items-center gap-1.5 bg-neutral-950/50 px-2.5 py-1 rounded-md border border-neutral-800/50">
                      <User size={14} className="text-neutral-400" />
                      <span>{notice.author_name || 'Department Admin'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neutral-950/50 px-2.5 py-1 rounded-md border border-neutral-800/50">
                      <Clock size={14} className="text-neutral-400" />
                      <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
