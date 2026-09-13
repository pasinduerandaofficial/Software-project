import React from 'react';
import { Plus, Book } from 'lucide-react';

const mockCourses = [
  { code: 'CE 3201', title: 'Geographic Info Systems', credits: 3 },
  { code: 'CE 3205', title: 'Remote Sensing', credits: 2 },
  { code: 'CE 4102', title: 'Advanced Surveying', credits: 4 },
];

export default function Courses() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Course Catalog</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage academic course units.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
          <Plus size={18} /> Add Course
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {mockCourses.map((course, idx) => (
          <div key={idx} className="card" style={{ borderTop: '4px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                  <Book size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{course.code}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{course.credits} Credits</div>
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 500 }}>{course.title}</div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button className="btn" style={{ flex: 1, border: '1px solid var(--border-light)', background: 'transparent' }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}