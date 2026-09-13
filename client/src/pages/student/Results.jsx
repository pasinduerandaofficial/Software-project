import React from 'react';
import { Download } from 'lucide-react';

export default function Results() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Academic Results</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View your semester-wise grades.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
          <Download size={18} /> Download Transcript
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', background: '#F3F4F6', borderBottom: '1px solid var(--border-light)', fontWeight: 600 }}>
          Semester 5 - SGPA: 3.84
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Course Code</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Title</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Credits</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {[
              { code: 'CE 3201', title: 'Geographic Info Systems', credits: 3, grade: 'A+' },
              { code: 'CE 3205', title: 'Remote Sensing', credits: 2, grade: 'A' },
            ].map((course, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{course.code}</td>
                <td style={{ padding: '1rem' }}>{course.title}</td>
                <td style={{ padding: '1rem' }}>{course.credits}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>{course.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}