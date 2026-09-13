import React from 'react';

export default function Timetable() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem' }}>Master Timetable</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View schedules across all halls and batches.</p>
      </div>
      <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', background: 'var(--bg-main)' }}>
        <p>Master Timetable Grid</p>
      </div>
    </div>
  );
}