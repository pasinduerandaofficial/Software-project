import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ links }) {
  const location = useLocation();

  return (
    <aside style={{ width: '250px', background: '#ecf0f1', padding: '1rem', minHeight: 'calc(100vh - 64px)' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {links.map((link, idx) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              <Link 
                to={link.path} 
                style={{ 
                  display: 'block', 
                  padding: '0.75rem 1rem', 
                  textDecoration: 'none', 
                  color: isActive ? 'white' : '#333',
                  background: isActive ? '#3498db' : 'transparent',
                  borderRadius: '4px'
                }}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  );
}
