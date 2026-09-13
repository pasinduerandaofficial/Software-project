import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, GraduationCap, BookOpen, Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem' }}>System Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to the Admin Control Panel.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#EEF2FF', color: 'var(--primary)', borderRadius: '12px' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Students</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>1,248</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#ECFDF5', color: 'var(--secondary)', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Active Staff</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>42</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#FEF3C7', color: 'var(--warning)', borderRadius: '12px' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Registered Courses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>156</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--primary)" />
          System Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { msg: 'Dr. Silva uploaded results for CE 3201', time: '2 hours ago' },
            { msg: 'New student account created (EG/2021/4055)', time: '4 hours ago' },
            { msg: 'System backup completed successfully', time: '1 day ago' }
          ].map((log, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: i !== 2 ? '1px solid var(--border-light)' : 'none' }}>
              <span style={{ fontWeight: 500 }}>{log.msg}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}