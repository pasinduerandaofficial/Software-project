import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '1rem', background: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Geomatics Portal</h2>
      {user && (
        <div>
          <span style={{ marginRight: '1rem' }}>{user.name} ({user.role})</span>
          <button onClick={logout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Logout</button>
        </div>
      )}
    </nav>
  );
}
