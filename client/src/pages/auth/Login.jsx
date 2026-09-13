import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login for demo purposes
    login({ 
      role, 
      name: role === 'student' ? 'Pasindu Eranda' : role === 'lecturer' ? 'Dr. Saman Silva' : 'Admin User' 
    });
    
    if (role === 'student') navigate('/student/overview');
    if (role === 'lecturer') navigate('/lecturer/overview');
    if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '64px', 
            height: '64px', 
            borderRadius: '16px', 
            background: 'var(--primary)',
            color: 'white',
            marginBottom: '1rem',
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
          }}>
            <GraduationCap size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#111827' }}>Geomatics Portal</h2>
          <p style={{ color: '#4B5563', marginTop: '0.5rem' }}>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Registration No. / Email
            </label>
            <input type="text" className="input-field" placeholder="E.g., EG/2021/4000" required />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input type="password" className="input-field" placeholder="••••••••" required />
          </div>

          <div style={{ padding: '1rem', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '8px', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
             <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Demo: Select Role to Login As
            </label>
            <select className="input-field" value={role} onChange={e => setRole(e.target.value)} style={{ borderColor: 'var(--primary)' }}>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', display: 'flex', gap: '0.5rem', padding: '0.75rem' }}>
            <LogIn size={18} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}