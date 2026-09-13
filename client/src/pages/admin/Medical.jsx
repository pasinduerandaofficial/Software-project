import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

export default function Medical() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/medical/all');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching medical requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/medical/${id}/status`, { status });
      fetchRequests();
    } catch (error) {
      alert('Error updating status');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem' }}>Medical Records</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Master ledger of all student medical submissions.</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Student</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Absence Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Reason</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>Review</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : requests.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{req.reg_no} - {req.name}</td>
                <td style={{ padding: '1rem' }}>{new Date(req.absence_date).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>{req.reason}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: req.status === 'approved' ? '#ECFDF5' : req.status === 'rejected' ? '#FEF2F2' : '#FEF3C7',
                    color: req.status === 'approved' ? 'var(--secondary)' : req.status === 'rejected' ? 'var(--danger)' : 'var(--warning)',
                    textTransform: 'capitalize'
                  }}>
                    {req.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => updateStatus(req.id, 'approved')}
                      disabled={req.status === 'approved'}
                      style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: req.status === 'approved' ? 'not-allowed' : 'pointer', opacity: req.status === 'approved' ? 0.3 : 1 }}
                      title="Approve"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button 
                      onClick={() => updateStatus(req.id, 'rejected')}
                      disabled={req.status === 'rejected'}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: req.status === 'rejected' ? 'not-allowed' : 'pointer', opacity: req.status === 'rejected' ? 0.3 : 1 }}
                      title="Reject"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && !loading && <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No records found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}