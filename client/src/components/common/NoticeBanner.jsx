import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function NoticeBanner() {
  const [notice, setNotice] = useState(null);
  const { selectedDepartment } = useAuth();

  useEffect(() => {
    // Fetch active notices and just display the most recent one
    const fetchNotices = async () => {
      try {
        const url = selectedDepartment ? `/api/notices?department=${selectedDepartment}` : '/api/notices';
        const res = await axios.get(url);
        if (res.data && res.data.length > 0) {
          setNotice(res.data[0].message);
        } else {
          setNotice(null);
        }
      } catch (error) {
        console.error('Failed to fetch notices', error);
      }
    };
    fetchNotices();
  }, []);

  if (!notice) return null;

  return (
    <div style={{ 
      background: 'var(--danger)', 
      color: 'white', 
      padding: '0.75rem 2rem', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      fontWeight: 500,
      fontSize: '0.875rem'
    }}>
      <Bell size={18} />
      <span>{notice}</span>
    </div>
  );
}
