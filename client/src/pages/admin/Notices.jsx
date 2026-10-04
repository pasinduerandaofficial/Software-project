import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [targetBatch, setTargetBatch] = useState('all');
  const { selectedDepartment } = useAuth();

  const fetchNotices = async () => {
    try {
      const url = selectedDepartment ? `/api/notices?department=${selectedDepartment}` : '/api/notices';
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

  useEffect(() => {
    fetchNotices();
  }, [selectedDepartment]);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/notices', { message, department: selectedDepartment, target_batch: targetBatch });
      setMessage('');
      setTargetBatch('all');
      setShowForm(false);
      fetchNotices();
    } catch (error) {
      alert('Error publishing notice');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notices/${id}`);
      fetchNotices();
    } catch (error) {
      alert('Error deleting notice');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Announcements</h1>
          <p className="text-neutral-400">
            Publish notices to the {selectedDepartment === 'SUGEO' ? 'Surveying & Geodesy' : 'Remote Sensing & GIS'} portal.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl transition-colors font-semibold">
          {showForm ? <X size={18} /> : <Plus size={18} />} Publish Notice
        </button>
      </div>

      {showForm && (
        <div className="bg-neutral-900/50 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
          <form onSubmit={handlePublish} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Type urgent announcement here..." 
                className="flex-1 bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" 
                value={message}
                onChange={e => setMessage(e.target.value)}
                required 
              />
              <select 
                value={targetBatch} 
                onChange={e => setTargetBatch(e.target.value)}
                className="bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-300 focus:outline-none focus:border-orange-500 transition-colors sm:w-48"
              >
                <option value="all">Entire Department</option>
                <option value="20GES">Batch 20 (Year 4)</option>
                <option value="21GES">Batch 21 (Year 3)</option>
                <option value="22GES">Batch 22 (Year 2)</option>
                <option value="23GES">Batch 23 (Year 1)</option>
                <option value="20RSG">Batch 20 (Year 4)</option>
                <option value="21RSG">Batch 21 (Year 3)</option>
                <option value="22RSG">Batch 22 (Year 2)</option>
                <option value="23RSG">Batch 23 (Year 1)</option>
              </select>
              <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">Broadcast</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {loading ? <div className="text-neutral-500 animate-pulse text-center p-4">Loading...</div> : notices.map(notice => (
          <div key={notice.id} className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/80 p-5 rounded-2xl flex justify-between items-center group hover:bg-neutral-900/60 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-200">{notice.message}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-neutral-500 text-sm">
                    Posted on {new Date(notice.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-neutral-700">•</span>
                  <span className="text-xs px-2 py-0.5 rounded border border-neutral-700 bg-neutral-800 text-neutral-400">
                    Target: {notice.target_batch === 'all' ? 'All' : notice.target_batch}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => handleDelete(notice.id)} className="text-neutral-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {notices.length === 0 && !loading && <div className="text-center p-8 bg-neutral-900/20 border border-neutral-800 rounded-2xl text-neutral-500">No active notices.</div>}
      </div>
    </div>
  );
}