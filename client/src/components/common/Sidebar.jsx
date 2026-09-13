import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Calendar, Activity, 
  FileText, Users, Settings, Bell, ClipboardList 
} from 'lucide-react';

const iconMap = {
  'Overview': LayoutDashboard,
  'Dashboard': LayoutDashboard,
  'Results': BookOpen,
  'Results Entry': ClipboardList,
  'Analytics': Activity,
  'Timetable': Calendar,
  'Medical': FileText,
  'Medical Reviews': FileText,
  'Users': Users,
  'Courses': BookOpen,
  'Notices': Bell,
};

export default function Sidebar({ links }) {
  const location = useLocation();

  return (
    <aside style={{ 
      width: '260px', 
      background: 'var(--bg-surface)', 
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '1.5rem 1rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map((link, idx) => {
            const isActive = location.pathname === link.path;
            const Icon = iconMap[link.label] || Settings;
            
            return (
              <li key={idx}>
                <Link 
                  to={link.path} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem', 
                    textDecoration: 'none', 
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    background: isActive ? '#EEF2FF' : 'transparent',
                    borderRadius: '8px',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon size={20} />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  );
}
