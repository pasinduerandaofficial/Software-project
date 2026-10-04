import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Edit2, Calendar, MapPin, User, Clock, AlertCircle } from 'lucide-react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function AdminTimetable() {
  const { selectedDepartment } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Group by batches dynamically
  const batches = [...new Set(timetable.map(t => t.batch_code))].sort().reverse();
  const [activeBatch, setActiveBatch] = useState(null);
  const [activeDay, setActiveDay] = useState('Monday');

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batch_code: '', semester: '1', day_of_week: 'Monday', start_time: '08:00', end_time: '10:00',
    course_code: '', course_name: '', lecture_hall: '', lecturer_name: '', special_notes: ''
  });

  useEffect(() => {
    fetchTimetable();
  }, [selectedDepartment]);

  useEffect(() => {
    if (batches.length > 0 && !activeBatch) {
      setActiveBatch(batches[0]);
    }
  }, [batches, activeBatch]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/timetable${selectedDepartment ? `?department=${selectedDepartment}` : ''}`);
      setTimetable(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/timetable', { ...formData, department: selectedDepartment });
      setShowForm(false);
      setFormData({
        batch_code: '', semester: '1', day_of_week: 'Monday', start_time: '08:00', end_time: '10:00',
        course_code: '', course_name: '', lecture_hall: '', lecturer_name: '', special_notes: ''
      });
      fetchTimetable();
    } catch (err) {
      alert('Error adding slot');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this schedule slot?')) return;
    try {
      await axios.delete(`/api/timetable/${id}`);
      fetchTimetable();
    } catch (err) {
      alert('Error deleting slot');
    }
  };

  const activeSlots = timetable.filter(s => s.batch_code === activeBatch && s.day_of_week === activeDay);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full font-sans pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Master Timetable</h1>
          <p className="text-neutral-400">
            Manage schedules and lecture hall allocations for {selectedDepartment || 'all departments'}.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl transition-colors font-semibold">
          <Plus size={18} /> Add New Slot
        </button>
      </div>

      {showForm && (
        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Add Timetable Slot</h2>
          <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input required type="text" placeholder="Batch Code (e.g. 22GES)" className="input-field" value={formData.batch_code} onChange={e => setFormData({...formData, batch_code: e.target.value})} />
            <input required type="number" placeholder="Semester (1-8)" min="1" max="8" className="input-field" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} />
            <select className="input-field" value={formData.day_of_week} onChange={e => setFormData({...formData, day_of_week: e.target.value})}>
              {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="flex gap-2">
              <input required type="time" className="input-field flex-1" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
              <input required type="time" className="input-field flex-1" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
            </div>
            
            <input required type="text" placeholder="Course Code (e.g. CE 3201)" className="input-field" value={formData.course_code} onChange={e => setFormData({...formData, course_code: e.target.value})} />
            <input required type="text" placeholder="Course Name" className="input-field lg:col-span-2" value={formData.course_name} onChange={e => setFormData({...formData, course_name: e.target.value})} />
            <input type="text" placeholder="Lecturer Name" className="input-field" value={formData.lecturer_name} onChange={e => setFormData({...formData, lecturer_name: e.target.value})} />
            
            <input required type="text" placeholder="Lecture Hall (e.g. Hall 01)" className="input-field lg:col-span-2" value={formData.lecture_hall} onChange={e => setFormData({...formData, lecture_hall: e.target.value})} />
            <input type="text" placeholder="Special Notes (Optional)" className="input-field lg:col-span-2" value={formData.special_notes} onChange={e => setFormData({...formData, special_notes: e.target.value})} />
            
            <div className="lg:col-span-4 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors">Save Slot</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-neutral-500 animate-pulse text-center p-8">Loading timetable...</div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Batch Tabs */}
          {batches.length > 0 && (
            <div className="flex gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
              {batches.map(batch => (
                <button
                  key={batch}
                  onClick={() => setActiveBatch(batch)}
                  className={`px-6 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap ${
                    activeBatch === batch ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'
                  }`}
                >
                  Batch {batch}
                </button>
              ))}
            </div>
          )}

          {/* Day Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {daysOfWeek.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap border ${
                  activeDay === day 
                    ? 'bg-neutral-800 border-neutral-700 text-orange-400 font-bold' 
                    : 'border-transparent text-neutral-500 hover:bg-neutral-900/50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeSlots.length === 0 ? (
              <div className="lg:col-span-2 text-center p-8 bg-neutral-900/20 border border-neutral-800/50 rounded-2xl text-neutral-500">
                No slots scheduled for this day.
              </div>
            ) : (
              activeSlots.map(slot => (
                <div key={slot.id} className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-5 rounded-2xl flex flex-col group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
                        {slot.start_time.substring(0,5)} - {slot.end_time.substring(0,5)}
                      </span>
                      <span className="ml-2 text-xs text-neutral-500 uppercase font-bold tracking-wider">
                        Sem {slot.semester}
                      </span>
                    </div>
                    <button onClick={() => handleDelete(slot.id)} className="text-neutral-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-neutral-200 mb-1">
                    {slot.course_code}: {slot.course_name}
                  </h3>
                  
                  <div className="flex flex-col gap-2 mt-3 text-sm text-neutral-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-neutral-500" />
                      <span className="text-neutral-300">{slot.lecture_hall}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-neutral-500" />
                      <span>{slot.lecturer_name || 'Unassigned'}</span>
                    </div>
                    {slot.special_notes && (
                      <div className="mt-2 text-xs text-neutral-500 italic bg-neutral-950/50 p-2 rounded">
                        Note: {slot.special_notes}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* Global CSS for input-field since it's used above but might not exist in global */}
      <style>{`
        .input-field {
          background-color: rgba(10, 10, 10, 0.5);
          border: 1px solid rgba(64, 64, 64, 0.8);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.875rem;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: #f97316;
        }
      `}</style>
    </div>
  );
}