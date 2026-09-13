import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, X } from 'lucide-react';
import axios from 'axios';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/api/notices');
      setNotices(res.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/notices', { message });
      setMessage('');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Announcements</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Publish global notices to all portals.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
          {showForm ? <X size={18} /> : <Plus size={18} />} Publish Notice
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ background: '#F8FAFC', borderLeft: '4px solid var(--primary)' }}>
          <form onSubmit={handlePublish} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Type urgent announcement here..." 
              className="input-field" 
              style={{ flex: 1 }}
              value={message}
              onChange={e => setMessage(e.target.value)}
              required 
            />
            <button type="submit" className="btn btn-primary">Broadcast</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? <p>Loading...</p> : notices.map(notice => (
          <div key={notice.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#FEF2F2', color: 'var(--danger)', borderRadius: '12px' }}>
                <Bell size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem' }}>{notice.message}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Posted on {new Date(notice.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button onClick={() => handleDelete(notice.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {notices.length === 0 && !loading && <p>No active notices.</p>}
      </div>
    </div>
  );
}