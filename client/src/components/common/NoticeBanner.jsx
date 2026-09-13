import React from 'react';

export default function NoticeBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{ padding: '1rem', background: '#f1c40f', color: '#333', textAlign: 'center', fontWeight: 'bold' }}>
      {message}
    </div>
  );
}
