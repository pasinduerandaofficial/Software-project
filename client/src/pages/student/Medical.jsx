import React, { useState, useEffect } from 'react';
import { FileText, Send } from 'lucide-react';
import axios from 'axios';

export default function Medical() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    absenceDate: '',
    reason: '',
    referenceId: ''
  });

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get('/api/medical/my-requests');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/medical/my-requests', formData);
      setFormData({ absenceDate: '', reason: '', referenceId: '' });
      fetchMyRequests(); // Refresh the list immediately after submission
      alert('Medical request submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting request');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem' }}>Medical Absence</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Submit medical details for lecture absences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary)" /> Submit New Request
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Absence Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.absenceDate}
                onChange={e => setFormData({...formData, absenceDate: e.target.value})}
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Reason for Absence</label>
              <textarea 
                className="input-field" 
                rows="3" 
                placeholder="Briefly describe your medical issue..." 
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
                required
              ></textarea>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Medical Reference ID (Optional)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Clinic Receipt No." 
                value={formData.referenceId}
                onChange={e => setFormData({...formData, referenceId: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
              <Send size={18} /> Submit Request
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>My Recent Submissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <p>Loading...</p>
            ) : requests.map(req => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#F9FAFB', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{new Date(req.absence_date).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{req.reason}</div>
                </div>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '999px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  background: req.status === 'approved' ? '#ECFDF5' : req.status === 'rejected' ? '#FEF2F2' : '#FEF3C7',
                  color: req.status === 'approved' ? 'var(--secondary)' : req.status === 'rejected' ? 'var(--danger)' : 'var(--warning)', 
                  height: 'fit-content',
                  textTransform: 'capitalize'
                }}>
                  {req.status}
                </span>
              </div>
            ))}
            {requests.length === 0 && !loading && (
              <p style={{ color: 'var(--text-secondary)' }}>No medical requests submitted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}