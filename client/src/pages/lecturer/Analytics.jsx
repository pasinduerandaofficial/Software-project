import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const gradeDistribution = [
  { name: 'A+', count: 5 }, { name: 'A', count: 12 }, { name: 'A-', count: 8 },
  { name: 'B+', count: 15 }, { name: 'B', count: 20 }, { name: 'C', count: 10 },
  { name: 'F', count: 3 }
];

export default function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem' }}>Course Analytics</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Performance insights for your classes.</p>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Grade Distribution (CE 3201)</h3>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
              <YAxis axisLine={false} tickLine={false} dx={-10} />
              <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}