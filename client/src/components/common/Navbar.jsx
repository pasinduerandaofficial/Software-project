import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Building2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminChatbox from '../chat/AdminChatbox';

import { messageService } from '../../services/messageService';

export default function Navbar() {
  const { user, logout, selectedDepartment } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    const handleToggle = () => setIsChatOpen(prev => !prev);
    window.addEventListener('toggleChat', handleToggle);
    return () => window.removeEventListener('toggleChat', handleToggle);
  }, []);

  React.useEffect(() => {
    let interval;
    const fetchUnread = async () => {
      try {
        const res = await messageService.getUnreadCount();
        if (res.success) setUnreadCount(res.unread);
      } catch (err) {}
    };

    if (user) {
      fetchUnread();
      interval = setInterval(fetchUnread, 10000);
      window.addEventListener('messagesRead', fetchUnread);
    }
    return () => {
      clearInterval(interval);
      window.removeEventListener('messagesRead', fetchUnread);
    };
  }, [user]);

  const getTheme = (dept) => {
    if (dept === 'SUGEO') return {
      iconBg: 'bg-emerald-500/10',
      iconText: 'text-emerald-500',
      roleText: 'text-emerald-400',
      hoverText: 'hover:text-emerald-400',
      badgeBg: 'bg-emerald-500',
      glow: 'shadow-[0_0_10px_rgba(16,185,129,0.6)]'
    };
    if (dept === 'RS_GIS') return {
      iconBg: 'bg-indigo-500/10',
      iconText: 'text-indigo-500',
      roleText: 'text-indigo-400',
      hoverText: 'hover:text-indigo-400',
      badgeBg: 'bg-indigo-500',
      glow: 'shadow-[0_0_10px_rgba(99,102,241,0.6)]'
    };
    return {
      iconBg: 'bg-orange-500/10',
      iconText: 'text-orange-500',
      roleText: 'text-orange-400',
      hoverText: 'hover:text-orange-400',
      badgeBg: 'bg-orange-500',
      glow: 'shadow-[0_0_10px_rgba(249,115,22,0.6)]'
    };
  };

  const theme = getTheme(selectedDepartment);

  return (
    <>
      <nav className="px-6 h-16 bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800/80 text-white flex justify-between items-center sticky top-0 z-10 shadow-lg shadow-black/20">

        {/* Brand Name (Dynamic based on selected office) */}
        <div className="flex items-center gap-3">
          <h2 className="m-0 text-xl text-white font-bold tracking-tight">
            {!selectedDepartment 
              ? 'Geo Offices' 
              : selectedDepartment === 'SUGEO' 
                ? 'Surveying & Geodesy' 
                : 'Remote Sensing & GIS'}
          </h2>
        </div>

        {/* User Profile & Actions */}
        {user && (
          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-neutral-200">{user.name}</div>
              <div className={`text-xs font-medium uppercase tracking-wider ${theme.roleText}`}>
                {user.role}
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-800 mx-2 hidden sm:block"></div>

            {/* Chat Icon */}
            <button 
              onClick={() => setIsChatOpen(prev => !prev)}
              className={`relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-neutral-400 bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-800 transition-colors ${theme.hoverText} ${isChatOpen ? 'bg-neutral-800 text-white' : ''}`}
              title="Messages"
            >
              <MessageSquare size={18} />
              {unreadCount > 0 && (
                <>
                  <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ${theme.badgeBg} text-[9px] font-bold text-white shadow-sm ring-2 ring-neutral-950 ${theme.glow}`}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                  <span className={`absolute -top-1 -right-1 h-4 w-4 rounded-full ${theme.badgeBg} opacity-75 animate-ping pointer-events-none`}></span>
                </>
              )}
            </button>

            <Link
              to="/select-office"
              className={`hidden sm:flex items-center gap-2 text-neutral-400 transition-colors text-sm font-medium mr-2 ${theme.hoverText}`}
            >
              <Building2 size={16} />
              <span>Switch Office</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-neutral-800/50 hover:bg-red-900/40 text-neutral-300 hover:text-red-400 border border-neutral-700/50 hover:border-red-800/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </nav>
      <AdminChatbox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
