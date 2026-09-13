import React from 'react';
import { FileText, Send } from 'lucide-react';

export default function Medical() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem' }}>Medical Absence</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Submit medical details for lecture absences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary)" /> Submit New Request
          </h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Absence Date</label>
              <input type="date" className="input-field" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Reason for Absence</label>
              <textarea className="input-field" rows="3" placeholder="Briefly describe your medical issue..." required></textarea>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Medical Reference ID (Optional)</label>
              <input type="text" className="input-field" placeholder="e.g. Clinic Receipt No." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
              <Send size={18} /> Submit Request
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Submissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#F9FAFB', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Oct 15, 2026</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Viral Fever</div>
              </div>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: '#FEF3C7', color: 'var(--warning)', height: 'fit-content' }}>Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}