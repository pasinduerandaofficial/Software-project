import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function NoticeBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{ 
      padding: '0.75rem 1.5rem', 
      background: '#FEF3C7', 
      color: '#92400E', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      borderBottom: '1px solid #FDE68A'
    }}>
      <AlertCircle size={18} />
      {message}
    </div>
  );
}
