import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, ClipboardList } from 'lucide-react';

export default function Overview() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem' }}>Lecturer Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}. Here's your overview.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#EEF2FF', color: 'var(--primary)', borderRadius: '12px' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Assigned Courses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>3</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#ECFDF5', color: 'var(--secondary)', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Students</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>142</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#FEF3C7', color: 'var(--warning)', borderRadius: '12px' }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Pending Grading</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>2 Batches</div>
          </div>
        </div>
      </div>
    </div>
  );
}