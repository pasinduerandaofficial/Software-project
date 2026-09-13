import React, { useState, useEffect } from 'react';
import { Save, Upload, Check } from 'lucide-react';
import axios from 'axios';

export default function ResultsEntry() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, usersRes] = await Promise.all([
          axios.get('/api/courses/my-courses'),
          axios.get('/api/users')
        ]);
        
        setCourses(coursesRes.data);
        if (coursesRes.data.length > 0) {
          setSelectedCourse(coursesRes.data[0].code);
        }
        
        setStudents(usersRes.data.filter(u => u.role === 'student'));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGradeChange = (regNo, grade) => {
    setGrades(prev => ({ ...prev, [regNo]: grade }));
  };

  const handleSaveGrades = async () => {
    if (!selectedCourse) return alert('Please select a course first.');
    
    setSaving(true);
    setSuccessMsg('');
    
    const submissions = Object.keys(grades).filter(regNo => grades[regNo]).map(regNo => ({
      studentRegNo: regNo,
      courseCode: selectedCourse,
      grade: grades[regNo]
    }));

    if (submissions.length === 0) {
      setSaving(false);
      return alert('No grades entered to save.');
    }

    try {
      // Submit each result sequentially
      for (const sub of submissions) {
        await axios.post('/api/results', sub);
      }
      setSuccessMsg(`Successfully saved ${submissions.length} grades for ${selectedCourse}!`);
      // Optional: Clear grades after saving, or leave them
      // setGrades({});
    } catch (error) {
      alert('An error occurred while saving grades.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Results Entry</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter grades for courses assigned to you.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            className="input-field" 
            value={selectedCourse} 
            onChange={e => setSelectedCourse(e.target.value)} 
            style={{ width: 'auto' }}
          >
            {courses.length === 0 && <option value="">No courses assigned</option>}
            {courses.map(c => (
              <option key={c.id} value={c.code}>{c.code}: {c.title}</option>
            ))}
          </select>
          <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
            <Upload size={18} /> Upload CSV
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '1rem', background: '#ECFDF5', color: '#047857', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={20} /> {successMsg}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Registration No</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : students.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{student.reg_no}</td>
                <td style={{ padding: '1rem' }}>{student.name}</td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  <select 
                    className="input-field" 
                    style={{ width: '100px', padding: '0.375rem 0.75rem' }}
                    value={grades[student.reg_no] || ''}
                    onChange={e => handleGradeChange(student.reg_no, e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="F">F</option>
                  </select>
                </td>
              </tr>
            ))}
            {students.length === 0 && !loading && (
              <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>No students found.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: '1rem', background: 'var(--bg-main)', textAlign: 'right', borderTop: '1px solid var(--border-light)' }}>
          <button 
            onClick={handleSaveGrades}
            disabled={saving || courses.length === 0}
            className="btn btn-primary" 
            style={{ display: 'inline-flex', gap: '0.5rem', opacity: saving || courses.length === 0 ? 0.6 : 1 }}
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Grades'}
          </button>
        </div>
      </div>
    </div>
  );
}