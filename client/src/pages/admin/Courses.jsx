import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, X } from 'lucide-react';
import axios from 'axios';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    credits: 3,
    lecturer_id: ''
  });

  const fetchData = async () => {
    try {
      const [coursesRes, usersRes] = await Promise.all([
        axios.get('/api/courses'),
        axios.get('/api/users')
      ]);
      setCourses(coursesRes.data);
      // Filter only lecturers for the dropdown
      setLecturers(usersRes.data.filter(u => u.role === 'lecturer'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/courses', formData);
      setShowForm(false);
      setFormData({ code: '', title: '', credits: 3, lecturer_id: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating course');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Course Catalog</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage available degree courses and assign teachers.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
          {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ background: '#F8FAFC' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Course</h3>
          <form onSubmit={handleAddCourse} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Course Code (e.g. CE 1201)" 
              className="input-field" 
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value})} 
              required 
            />
            <input 
              type="text" 
              placeholder="Course Title" 
              className="input-field" 
              style={{ flex: 1 }}
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
            />
            <input 
              type="number" 
              placeholder="Credits" 
              className="input-field" 
              style={{ width: '100px' }}
              value={formData.credits} 
              onChange={e => setFormData({...formData, credits: Number(e.target.value)})} 
              required 
            />
            <select 
              className="input-field" 
              value={formData.lecturer_id} 
              onChange={e => setFormData({...formData, lecturer_id: e.target.value})}
              required
            >
              <option value="" disabled>Select Lecturer</option>
              {lecturers.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">Save Course</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <p>Loading courses...</p>
        ) : courses.map(course => (
          <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', background: '#EEF2FF', color: 'var(--primary)', borderRadius: '12px' }}>
                <BookOpen size={24} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{course.credits} Credits</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{course.code}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{course.title}</p>
            </div>
            {course.lecturer_name && (
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                👨‍🏫 Taught by: <strong>{course.lecturer_name}</strong>
              </div>
            )}
          </div>
        ))}
        {courses.length === 0 && !loading && (
          <p>No courses found in database.</p>
        )}
      </div>
    </div>
  );
}