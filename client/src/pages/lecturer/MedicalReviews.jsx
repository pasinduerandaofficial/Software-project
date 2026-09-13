import React from 'react';
import { Check, X, Eye } from 'lucide-react';

export default function MedicalReviews() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem' }}>Medical Reviews</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review student absence requests.</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Student Reg No</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Reason</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '1rem' }}>Oct 15, 2026</td>
              <td style={{ padding: '1rem', fontWeight: 500 }}>EG/2021/4000</td>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Viral Fever (3 days)</td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button className="btn" style={{ padding: '0.375rem', background: '#ECFDF5', color: 'var(--secondary)', marginRight: '0.5rem' }}><Check size={16} /></button>
                <button className="btn" style={{ padding: '0.375rem', background: '#FEF2F2', color: 'var(--danger)', marginRight: '0.5rem' }}><X size={16} /></button>
                <button className="btn" style={{ padding: '0.375rem', background: '#F3F4F6', color: 'var(--text-primary)' }}><Eye size={16} /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}