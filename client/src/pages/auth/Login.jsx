import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Login() {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(regNo, password);
    
    if (result.success) {
      if (result.role === 'admin') navigate('/admin/dashboard');
      else if (result.role === 'lecturer') navigate('/lecturer/overview');
      else navigate('/student/overview');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f4f4f5', // light grey background
      backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      padding: '1rem'
    }}>
      <div className="card" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '3rem 2.5rem',
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05), 0 0px 15px rgba(0,0,0,0.02)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img 
            src={logo} 
            alt="University Logo" 
            style={{
              width: '90px',
              height: '90px',
              objectFit: 'contain',
              marginBottom: '1.5rem',
              filter: 'grayscale(100%) contrast(1.2)' // Forces the red logo to fit the B&W theme
            }}
          />
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 800, 
            color: '#111827', 
            letterSpacing: '-0.025em',
            marginBottom: '0.5rem' 
          }}>
            Geo Offices
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Enter your credentials to access the portal</p>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem 1rem', 
            background: '#fee2e2', 
            border: '1px solid #f87171',
            color: '#b91c1c', 
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Registration Number / Username
            </label>
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                fontSize: '1rem',
                color: '#111827',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              placeholder="e.g. EG/2021/4000"
              required
              onFocus={e => { e.target.style.borderColor = '#111827'; e.target.style.background = 'white'; }}
              onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.background = '#f9fafb'; }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Password
              </label>
              <a href="#" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert("Please contact the IT Helpdesk to reset your password."); }}>
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                fontSize: '1rem',
                color: '#111827',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              placeholder="••••••••"
              required
              onFocus={e => { e.target.style.borderColor = '#111827'; e.target.style.background = 'white'; }}
              onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.background = '#f9fafb'; }}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              marginTop: '0.5rem', 
              padding: '0.875rem',
              background: '#111827',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            disabled={loading}
            onMouseOver={e => !loading && (e.target.style.background = '#374151')}
            onMouseOut={e => !loading && (e.target.style.background = '#111827')}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}