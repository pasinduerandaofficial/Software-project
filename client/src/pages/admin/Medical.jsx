import React from 'react';

export default function Medical() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem' }}>Master Medical Records</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View all processed medical requests.</p>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Student Reg No</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '1rem' }}>Oct 10, 2026</td>
              <td style={{ padding: '1rem', fontWeight: 500 }}>EG/2021/4000</td>
              <td style={{ padding: '1rem', color: 'var(--secondary)' }}>Approved</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}