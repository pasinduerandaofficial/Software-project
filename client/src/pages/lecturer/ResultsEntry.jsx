import React, { useState } from 'react';
import { Save, Upload } from 'lucide-react';

export default function ResultsEntry() {
  const [course, setCourse] = useState('CE 3201');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Results Entry</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter or upload grades for your students.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="input-field" value={course} onChange={e => setCourse(e.target.value)} style={{ width: 'auto' }}>
            <option value="CE 3201">CE 3201: Geographic Info Systems</option>
            <option value="CE 3205">CE 3205: Remote Sensing</option>
          </select>
          <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
            <Upload size={18} /> Upload CSV
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Registration No</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {['EG/2021/4000', 'EG/2021/4001', 'EG/2021/4002'].map((reg, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{reg}</td>
                <td style={{ padding: '1rem' }}>Student Name</td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  <select className="input-field" style={{ width: '100px', padding: '0.375rem 0.75rem' }}>
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="F">F</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '1rem', background: 'var(--bg-main)', textAlign: 'right', borderTop: '1px solid var(--border-light)' }}>
          <button className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
            <Save size={18} /> Save Grades
          </button>
        </div>
      </div>
    </div>
  );
}