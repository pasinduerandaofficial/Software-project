import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, Clock, Calendar as CalendarIcon } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const gpaData = [
  { name: 'Sem 1', gpa: 3.2 },
  { name: 'Sem 2', gpa: 3.4 },
  { name: 'Sem 3', gpa: 3.1 },
  { name: 'Sem 4', gpa: 3.6 },
  { name: 'Sem 5', gpa: 3.8 },
];

export default function Overview() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header section */}
      <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${
          user?.department === 'SUGEO' ? 'from-emerald-500/10' : 'from-indigo-500/10'
        } rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none`}></div>
        
        <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-neutral-400 mb-6 relative z-10">Here is what's happening with your academics today.</p>
        
        <div className="flex flex-wrap gap-3 relative z-10">
          <div className="bg-neutral-950/50 border border-neutral-800/80 rounded-lg px-4 py-2 flex flex-col">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Index Number</span>
            <span className="text-sm font-semibold text-neutral-200">{user?.regNo}</span>
          </div>
          <div className="bg-neutral-950/50 border border-neutral-800/80 rounded-lg px-4 py-2 flex flex-col">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Active Batch</span>
            <span className={`text-sm font-semibold ${user?.department === 'SUGEO' ? 'text-emerald-400' : 'text-indigo-400'}`}>
              Batch {user?.batchCode ? user.batchCode.replace(/[^0-9]/g, '') : 'N/A'} ({user?.batchCode})
            </span>
          </div>
          <div className="bg-neutral-950/50 border border-neutral-800/80 rounded-lg px-4 py-2 flex flex-col">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Academic Year</span>
            <span className="text-sm font-semibold text-orange-400">Year {user?.academicYear || 1}</span>
          </div>
          <div className="bg-neutral-950/50 border border-neutral-800/80 rounded-lg px-4 py-2 flex flex-col">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Current Semester</span>
            <span className="text-sm font-semibold text-purple-400">Semester {user?.currentSemester || 1}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#EEF2FF', color: 'var(--primary)', borderRadius: '12px' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Current SGPA</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>3.84</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#ECFDF5', color: 'var(--secondary)', borderRadius: '12px' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Credits</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>64 / 120</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#FEF3C7', color: 'var(--warning)', borderRadius: '12px' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Pending Assignments</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>3</div>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Chart Section */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>GPA Progression</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis domain={[0, 4.0]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="gpa" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg-surface)' }}
                  activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'none' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Schedule Sidebar */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Upcoming Classes</h3>
            <CalendarIcon size={20} color="var(--text-secondary)" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--primary)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>CE 3201: Geographic Info Systems</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>10:30 AM - 12:30 PM • Lab 4</div>
            </div>
            
            <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--secondary)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>CE 3205: Remote Sensing</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>1:30 PM - 3:30 PM • Hall B</div>
            </div>
          </div>

          <button className="btn" style={{ width: '100%', marginTop: '2rem', background: '#F3F4F6', color: 'var(--text-primary)' }}>
            View Full Timetable
          </button>
        </div>

      </div>
    </div>
  );
}