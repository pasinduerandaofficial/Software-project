import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, CheckCircle2, Circle, Clock, FileText, Search, User } from 'lucide-react';

export default function AdminSubmissions() {
  const { selectedDepartment } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const [courses, setCourses] = useState([]);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [formData, setFormData] = useState({
    batch_code: '', course_code: '', title: '', type: 'land_survey'
  });

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const url = `/api/submissions/tasks${selectedDepartment ? `?department=${selectedDepartment}` : ''}`;
      const res = await axios.get(url);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const url = `/api/courses${selectedDepartment ? `?department=${selectedDepartment}` : ''}`;
      const res = await axios.get(url);
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCourses();
    setSelectedTask(null);
  }, [selectedDepartment]);

  const fetchRecords = async (taskId) => {
    try {
      setLoadingRecords(true);
      const res = await axios.get(`/api/submissions/tasks/${taskId}/records`);
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching records', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    fetchRecords(task.id);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/submissions/tasks', { ...formData, department: selectedDepartment });
      setShowTaskForm(false);
      setFormData({ batch_code: '', course_code: '', title: '', type: 'land_survey' });
      fetchTasks();
    } catch (err) {
      alert('Error creating task');
    }
  };

  const handleDeleteTask = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this task and all student records?')) return;
    try {
      await axios.delete(`/api/submissions/tasks/${id}`);
      if (selectedTask?.id === id) setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const updateRecordStatus = async (recordId, status) => {
    try {
      await axios.patch(`/api/submissions/records/${recordId}`, { status });
      // update local state
      setRecords(records.map(r => r.id === recordId ? { ...r, status } : r));
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full font-sans pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Document Submissions</h1>
          <p className="text-neutral-400">Track and manage student practical submissions.</p>
        </div>
        <button onClick={() => setShowTaskForm(!showTaskForm)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl transition-colors font-semibold shadow-lg">
          <Plus size={18} /> New Assignment
        </button>
      </div>

      {showTaskForm && (
        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Create Submission Task</h2>
          <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input required type="text" placeholder="Batch Code (e.g. 21GES)" className="px-4 py-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-orange-500" value={formData.batch_code} onChange={e => setFormData({...formData, batch_code: e.target.value})} />
              <select required className="px-4 py-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-orange-500" value={formData.course_code} onChange={e => setFormData({...formData, course_code: e.target.value})}>
                <option value="" disabled>Select Course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.code}>{c.code}</option>
                ))}
              </select>
              <input required type="text" placeholder="Assignment Title" className="md:col-span-2 px-4 py-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-orange-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="flex gap-4 items-center">
              <select className="px-4 py-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-neutral-300 focus:outline-none focus:border-orange-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="land_survey">Land Survey Practical</option>
                <option value="other_subjects">Other Subject</option>
              </select>
              <div className="flex-1"></div>
              <button type="button" onClick={() => setShowTaskForm(false)} className="px-6 py-2 rounded-xl text-neutral-400 hover:bg-neutral-800 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors">Create</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tasks Sidebar */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white mb-2">Assignments</h2>
          
          <div className="flex flex-col gap-3">
            {loadingTasks ? (
              <div className="text-neutral-500 animate-pulse text-center p-4">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-neutral-500 text-center p-8 bg-neutral-900/50 rounded-2xl border border-neutral-800">No assignments created.</div>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => handleSelectTask(task)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all group ${selectedTask?.id === task.id ? 'bg-orange-500/10 border-orange-500/50' : 'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800/80'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded tracking-wide">{task.course_code}</span>
                    <button onClick={(e) => handleDeleteTask(task.id, e)} className="text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className={`font-semibold mb-1 ${selectedTask?.id === task.id ? 'text-orange-400' : 'text-neutral-200'}`}>{task.title}</h3>
                  <div className="flex justify-between text-xs text-neutral-500 mt-3">
                    <span>Batch {task.batch_code}</span>
                    <span className="capitalize">{task.type.replace('_', ' ')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tracking Grid */}
        <div className="lg:w-2/3">
          {selectedTask ? (
            <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-2xl min-h-[500px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-800">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedTask.title}</h2>
                  <p className="text-neutral-400 mt-1">
                    {selectedTask.course_code} • Batch {selectedTask.batch_code}
                  </p>
                </div>
                
                <div className="flex gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Circle size={14} /> Pending ({records.filter(r => r.status === 'pending').length})
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <CheckCircle2 size={14} /> Submitted ({records.filter(r => r.status === 'submitted').length})
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 size={14} /> Evaluated ({records.filter(r => r.status === 'evaluated').length})
                  </div>
                </div>
              </div>

              {loadingRecords ? (
                <div className="text-center p-12 text-neutral-500 animate-pulse">Loading student records...</div>
              ) : records.length === 0 ? (
                <div className="text-center p-12 text-neutral-500 flex flex-col items-center">
                  <User size={48} className="opacity-20 mb-4" />
                  No students found in this batch.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {records.map(record => (
                    <div key={record.id} className="flex flex-col gap-3 p-4 bg-neutral-950/50 border border-neutral-800/80 rounded-2xl hover:border-neutral-700 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-neutral-200">{record.student_reg_no}</div>
                          <div className="text-xs text-neutral-500 truncate max-w-[150px]">{record.student_name}</div>
                        </div>
                        
                        <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateRecordStatus(record.id, 'pending')}
                            className={`p-2 transition-colors ${record.status === 'pending' ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:bg-neutral-800'}`}
                            title="Pending"
                          ><Circle size={16} /></button>
                          
                          <button 
                            onClick={() => updateRecordStatus(record.id, 'submitted')}
                            className={`p-2 transition-colors ${record.status === 'submitted' ? 'bg-blue-600 text-white' : 'text-neutral-500 hover:bg-neutral-800'}`}
                            title="Submitted"
                          ><Clock size={16} /></button>
                          
                          <button 
                            onClick={() => updateRecordStatus(record.id, 'evaluated')}
                            className={`p-2 transition-colors ${record.status === 'evaluated' ? 'bg-emerald-600 text-white' : 'text-neutral-500 hover:bg-neutral-800'}`}
                            title="Evaluated"
                          ><CheckCircle2 size={16} /></button>
                        </div>
                      </div>
                      
                      {record.submitted_at && record.status !== 'pending' && (
                        <div className="text-[10px] text-neutral-600 uppercase tracking-wide font-bold">
                          Updated: {new Date(record.submitted_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-neutral-500 bg-neutral-900/30 border border-neutral-800/50 rounded-3xl border-dashed">
              <FileText size={48} className="mb-4 opacity-20" />
              <p>Select an assignment to view and manage student submissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
