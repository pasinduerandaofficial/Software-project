import React from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';

export default function Notices() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Notice Banners</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage global alerts shown to users.</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} color="var(--primary)" /> Create New Notice
        </h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="text" className="input-field" placeholder="Enter notice message here..." style={{ flex: 1 }} />
          <button className="btn btn-primary">Publish</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Notice Message</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '1rem' }}>Important: End of semester exams start next week!</td>
              <td style={{ padding: '1rem' }}><span style={{ color: 'var(--secondary)', fontWeight: 600 }}>Active</span></td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}