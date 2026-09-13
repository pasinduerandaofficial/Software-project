import React, { useState, useEffect } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('/api/results/my-results');
        setResults(res.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Helper function to convert grade to GPA points
  const getGradePoint = (grade) => {
    switch (grade) {
      case 'A+': return 4.0;
      case 'A': return 4.0;
      case 'A-': return 3.7;
      case 'B+': return 3.3;
      case 'B': return 3.0;
      case 'B-': return 2.7;
      case 'C+': return 2.3;
      case 'C': return 2.0;
      case 'C-': return 1.7;
      case 'F': return 0.0;
      default: return 0.0;
    }
  };

  // Calculate SGPA dynamically based on fetched results
  const calculateSGPA = () => {
    if (results.length === 0) return 0.00;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    results.forEach(res => {
      totalPoints += getGradePoint(res.grade) * res.credits;
      totalCredits += res.credits;
    });

    return totalCredits === 0 ? 0.00 : (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Academic Results</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View your official grades and transcript.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
          <Download size={18} /> Download Transcript
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', background: '#F3F4F6', borderBottom: '1px solid var(--border-light)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
          <span>Current GPA</span>
          <span style={{ color: 'var(--primary)', fontSize: '1.125rem' }}>{calculateSGPA()}</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Course Code</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Title</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Credits</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center' }}>Loading your results...</td></tr>
            ) : results.map((result) => (
              <tr key={result.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{result.code}</td>
                <td style={{ padding: '1rem' }}>{result.title}</td>
                <td style={{ padding: '1rem' }}>{result.credits}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: 'var(--primary)', fontSize: '1.125rem' }}>
                  {result.grade}
                </td>
              </tr>
            ))}
            
            {results.length === 0 && !loading && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={32} color="var(--warning)" />
                    <p>No results have been published for you yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}