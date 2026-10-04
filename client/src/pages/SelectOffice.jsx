import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, LogOut, MapPin } from 'lucide-react';
import sugeoIcon from '../assets/sugeo_icon.jpg';
import rsgisIcon from '../assets/rsgis_icon.jpg';

export default function SelectOffice() {
  const { user, setDepartment, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (deptKey) => {
    setDepartment(deptKey);
    // Navigate based on role
    if (user.role === 'admin') navigate('/admin/dashboard');
    else if (user.role === 'lecturer') navigate('/lecturer/overview');
    else navigate('/student/overview');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden text-neutral-200 font-sans p-6 md:p-12">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Core Glowing Orbs */}
        <div className="absolute top-[-25%] right-[-15%] w-[60%] h-[60%] bg-blue-900/15 rounded-full blur-[140px] opacity-70"></div>
        <div className="absolute bottom-[-20%] left-[-15%] w-[50%] h-[50%] bg-emerald-900/15 rounded-full blur-[120px] opacity-70"></div>
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-orange-900/10 rounded-full blur-[100px] opacity-50"></div>
        
        {/* Professional Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_80%,transparent_100%)]"></div>
      </div>

      {/* Header Bar */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex justify-between items-center mb-16">
        <div className="flex items-center gap-3 bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-lg shadow-black/40">
          <MapPin className="text-orange-500" size={18} />
          <span className="text-sm font-bold tracking-widest uppercase text-neutral-200">Geo Offices</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-neutral-400 hover:text-white bg-neutral-900/40 hover:bg-red-900/50 border border-neutral-800/60 hover:border-red-800/60 rounded-full transition-all duration-300"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Cancel & Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center">
        
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-orange-300 via-orange-500 to-amber-600 mb-4 tracking-tight drop-shadow-sm">
            Welcome back, {user.name}
          </h1>
        </div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          
          {/* Card 1: SUGEO */}
          <button 
            onClick={() => handleSelect('SUGEO')}
            className="group relative flex flex-col items-center justify-center text-center bg-emerald-900/20 backdrop-blur-2xl border border-emerald-800/40 hover:border-emerald-500/60 hover:bg-emerald-900/40 rounded-[2rem] p-10 transition-all duration-500 shadow-[0_8px_32px_rgba(16,185,129,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:-translate-y-2"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 via-emerald-500/5 to-emerald-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="mb-8 relative rounded-full overflow-hidden w-40 h-40 ring-4 ring-emerald-500/40 group-hover:ring-emerald-400/80 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-500">
              <img src={sugeoIcon} alt="Surveying & Geodesy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-emerald-50 transition-colors z-10">Surveying & Geodesy</h3>
            
            <div className="mt-6 flex items-center text-emerald-400 font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 z-10">
              Enter Workspace <ChevronRight size={18} className="ml-2" />
            </div>
          </button>

          {/* Card 2: RS & GIS */}
          <button 
            onClick={() => handleSelect('RS_GIS')}
            className="group relative flex flex-col items-center justify-center text-center bg-indigo-900/20 backdrop-blur-2xl border border-indigo-800/40 hover:border-indigo-500/60 hover:bg-indigo-900/40 rounded-[2rem] p-10 transition-all duration-500 shadow-[0_8px_32px_rgba(99,102,241,0.1)] hover:shadow-[0_0_40px_rgba(99,102,241,0.25)] overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:-translate-y-2"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/0 via-indigo-500/5 to-indigo-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="mb-8 relative rounded-full overflow-hidden w-40 h-40 ring-4 ring-indigo-500/40 group-hover:ring-indigo-400/80 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-500">
              <img src={rsgisIcon} alt="Remote Sensing & GIS" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-50 transition-colors z-10">Remote Sensing & GIS</h3>
            
            <div className="mt-6 flex items-center text-indigo-400 font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 z-10">
              Enter Workspace <ChevronRight size={18} className="ml-2" />
            </div>
          </button>
        </div>

        {/* Platform Description */}
        <div className="text-center max-w-3xl mx-auto px-6">
          <p className="text-neutral-400 text-sm md:text-base leading-loose font-medium">
            Choose your department workspace to access specialized timetables, results, and faculty notices. Geo Offices provides a unified digital ecosystem for students and staff of the Faculty of Geomatics.
          </p>
        </div>
      </div>
    </div>
  );
}
