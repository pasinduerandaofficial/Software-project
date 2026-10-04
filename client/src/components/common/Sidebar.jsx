import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { noticeService } from '../../services/noticeService';
import { 
  LayoutDashboard, BookOpen, Calendar, Activity, 
  FileText, Users, Settings, Bell, ClipboardList, MessageSquare
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
  'Notice Board': Bell,
  'Submission': FileText,
};

export default function Sidebar({ links }) {
  const location = useLocation();
  const { selectedDepartment, user } = useAuth();
  const [noticeUnreadCount, setNoticeUnreadCount] = useState(0);

  useEffect(() => {
    let interval;
    const fetchNoticeUnread = async () => {
      try {
        const res = await noticeService.getUnreadCount(selectedDepartment, user?.batchCode);
        if (res.success) setNoticeUnreadCount(res.unread);
      } catch (err) {}
    };

    if (user) {
      fetchNoticeUnread();
      interval = setInterval(fetchNoticeUnread, 10000);
      window.addEventListener('noticesRead', fetchNoticeUnread);
    }
    return () => {
      clearInterval(interval);
      window.removeEventListener('noticesRead', fetchNoticeUnread);
    };
  }, [user, selectedDepartment]);

  const getTheme = (dept) => {
    if (dept === 'SUGEO') return {
      activeBg: 'bg-emerald-500/10',
      activeText: 'text-emerald-500',
      activeShadow: 'shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
    };
    if (dept === 'RS_GIS') return {
      activeBg: 'bg-indigo-500/10',
      activeText: 'text-indigo-500',
      activeShadow: 'shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
    };
    return {
      activeBg: 'bg-orange-500/10',
      activeText: 'text-orange-500',
      activeShadow: 'shadow-[inset_0_0_0_1px_rgba(249,115,22,0.2)]'
    };
  };

  const theme = getTheme(selectedDepartment);

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800/80 flex flex-col flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-5">
        <ul className="list-none p-0 m-0 flex flex-col gap-2">
          {links.map((link, idx) => {
            const isActive = location.pathname === link.path;
            const Icon = iconMap[link.label] || Settings;
            
            return (
              <li key={idx}>
                <Link 
                  to={link.path} 
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? `${theme.activeBg} ${theme.activeText} ${theme.activeShadow}` 
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={isActive ? theme.activeText : 'text-neutral-500'} />
                    {link.label}
                  </div>
                  
                  {link.label === 'Notice Board' && (
                    <div className="relative flex items-center justify-center">
                      <span className={`flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-bold shadow-sm ring-1 ring-neutral-950 z-10 ${
                        noticeUnreadCount > 0 
                          ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.6)]' 
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {noticeUnreadCount > 9 ? '9+' : noticeUnreadCount}
                      </span>
                      {noticeUnreadCount > 0 && (
                        <span className="absolute inset-0 rounded-full bg-orange-500 opacity-75 animate-ping pointer-events-none"></span>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  );
}
