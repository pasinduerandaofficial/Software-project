import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, User, AlertCircle, Search } from 'lucide-react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function LecturerTimetable() {
  const { user } = useAuth();
  const [mySchedule, setMySchedule] = useState([]);
  const [batchSchedule, setBatchSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [viewMode, setViewMode] = useState('mine'); // 'mine' or 'batch'
  const [selectedBatch, setSelectedBatch] = useState('22GES');
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date().getDay();
    if (today >= 1 && today <= 5) return daysOfWeek[today - 1];
    return 'Monday';
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        // Fetch Lecturer's personal schedule
        const resMine = await axios.get(`/api/timetable?lecturer_id=${user.id}`);
        setMySchedule(resMine.data);

        // Fetch selected batch schedule
        const resBatch = await axios.get(`/api/timetable?batch_code=${selectedBatch}`);
        setBatchSchedule(resBatch.data);
      } catch (err) {
        console.error('Error fetching timetable', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [user.id, selectedBatch]);

  const activeSlots = (viewMode === 'mine' ? mySchedule : batchSchedule).filter(s => s.day_of_week === activeDay);

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full font-sans pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Timetable</h1>
          <p className="text-neutral-400">View your classes or search the master schedule.</p>
        </div>
        
        <div className="flex bg-neutral-900/80 border border-neutral-800 rounded-xl p-1">
          <button 
            onClick={() => setViewMode('mine')} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'mine' ? 'bg-purple-600 text-white shadow-lg' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            My Classes
          </button>
          <button 
            onClick={() => setViewMode('batch')} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'batch' ? 'bg-purple-600 text-white shadow-lg' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Batch Lookup
          </button>
        </div>
      </div>

      {viewMode === 'batch' && (
        <div className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl">
          <Search className="text-neutral-500" />
          <select 
            value={selectedBatch} 
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none flex-1 text-lg font-semibold"
          >
            <option value="20GES">Batch 20 (GES)</option>
            <option value="21GES">Batch 21 (GES)</option>
            <option value="22GES">Batch 22 (GES)</option>
            <option value="23GES">Batch 23 (GES)</option>
            <option value="20RSG">Batch 20 (RS_GIS)</option>
            <option value="21RSG">Batch 21 (RS_GIS)</option>
            <option value="22RSG">Batch 22 (RS_GIS)</option>
            <option value="23RSG">Batch 23 (RS_GIS)</option>
          </select>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Day Selector */}
        <div className="lg:w-64 flex flex-col gap-2">
          {daysOfWeek.map(day => {
            const dayCount = (viewMode === 'mine' ? mySchedule : batchSchedule).filter(s => s.day_of_week === day).length;
            const isActive = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-neutral-800 text-white border border-neutral-700 shadow-xl' 
                    : 'bg-neutral-900/50 text-neutral-400 hover:bg-neutral-800/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} className={isActive ? 'text-purple-400' : ''} />
                  <span className="font-medium">{day}</span>
                </div>
                {dayCount > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-neutral-800 text-neutral-500'
                  }`}>
                    {dayCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Schedule Grid */}
        <div className="flex-1 bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 min-h-[400px]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Schedule for {activeDay}
          </h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
              <span className="animate-pulse">Loading schedule...</span>
            </div>
          ) : activeSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 bg-neutral-950/50 border border-neutral-800/50 rounded-2xl border-dashed">
              <Calendar size={48} className="mb-4 opacity-20" />
              <p>No classes scheduled for {activeDay}.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
              {activeSlots.map((slot, index) => (
                <div key={slot.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                  {/* Timeline Node */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-neutral-900 bg-neutral-800 text-neutral-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:bg-purple-500 group-hover:text-white transition-colors z-10">
                    <Clock size={16} />
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-neutral-950/80 border border-neutral-800 p-5 rounded-2xl shadow-lg group-hover:border-neutral-700 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        {slot.batch_code}
                      </span>
                    </div>
                    
                    <h3 className={`text-lg font-bold mb-1 ${slot.status === 'cancelled' ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                      {slot.course_code}: {slot.course_name}
                    </h3>
                    
                    <div className="flex flex-col gap-2 mt-4 text-sm text-neutral-400">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-neutral-500" />
                        <span>{slot.lecture_hall || 'TBA'}</span>
                      </div>
                      {viewMode === 'batch' && (
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-neutral-500" />
                          <span>{slot.lecturer_name || 'TBA'}</span>
                        </div>
                      )}
                      {slot.special_notes && (
                        <div className="mt-2 p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 text-xs flex gap-2">
                          <AlertCircle size={14} className="text-purple-500 shrink-0" />
                          <span>{slot.special_notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}