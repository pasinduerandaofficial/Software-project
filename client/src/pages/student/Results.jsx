import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, Award, BookOpen, GraduationCap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentResults() {
  const { user } = useAuth();
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
      case 'D+': return 1.3;
      case 'D': return 1.0;
      case 'E': return 0.0;
      case 'F': return 0.0;
      default: return 0.0;
    }
  };

  const calculateGPA = (courses) => {
    if (!courses || courses.length === 0) return 0.00;
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      totalPoints += getGradePoint(c.grade) * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits === 0 ? 0.00 : (totalPoints / totalCredits).toFixed(2);
  };

  const cgpa = calculateGPA(results);
  
  // Group by semester (1 to 8)
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8].map(sem => ({
    id: sem,
    label: `Semester ${sem}`,
    courses: results.filter(r => r.semester === sem)
  }));

  const getThemeColor = () => user?.department === 'SUGEO' ? 'text-emerald-400 border-emerald-500 bg-emerald-500/10' : 'text-indigo-400 border-indigo-500 bg-indigo-500/10';

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full font-sans pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Academic Transcript</h1>
          <p className="text-neutral-400">
            Official results breakdown for <span className="font-semibold text-neutral-200">{user?.regNo}</span>.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white px-4 py-2 rounded-xl transition-colors font-semibold shadow-lg">
          <Download size={18} /> Export PDF
        </button>
      </div>

      {/* CGPA Card */}
      <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${getThemeColor()}`}>
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 className="text-neutral-400 font-semibold tracking-wide uppercase text-sm">Cumulative GPA</h2>
            <div className="text-4xl font-bold text-white mt-1">{cgpa}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-neutral-500 text-sm font-medium">Total Credits Completed</div>
          <div className="text-2xl font-bold text-neutral-200 mt-1">
            {results.reduce((acc, c) => acc + c.credits, 0)}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8 text-neutral-500 animate-pulse">Loading academic history...</div>
      ) : results.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900/30 border border-neutral-800 rounded-3xl text-neutral-500 flex flex-col items-center gap-4">
          <AlertCircle size={48} className="opacity-50" />
          <p className="text-lg">No results have been published for your index number yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {semesters.map((sem) => {
            if (sem.courses.length === 0) return null;
            const sgpa = calculateGPA(sem.courses);
            
            return (
              <div key={sem.id} className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950/50 flex justify-between items-center">
                  <h3 className="font-bold text-neutral-200 text-lg">{sem.label}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold">SGPA</span>
                    <span className={`font-bold ${user?.department === 'SUGEO' ? 'text-emerald-400' : 'text-indigo-400'}`}>{sgpa}</span>
                  </div>
                </div>
                
                <div className="p-2 flex-1">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-neutral-500 text-xs uppercase tracking-wider">
                        <th className="px-3 py-2 font-medium">Course</th>
                        <th className="px-3 py-2 font-medium text-center">Cr</th>
                        <th className="px-3 py-2 font-medium text-right">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {sem.courses.map(course => (
                        <tr key={course.id} className="border-t border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                          <td className="px-3 py-3">
                            <div className="font-bold text-neutral-300">{course.code}</div>
                            <div className="text-neutral-500 text-xs truncate max-w-[200px]" title={course.title}>{course.title}</div>
                          </td>
                          <td className="px-3 py-3 text-center text-neutral-400">{course.credits}</td>
                          <td className="px-3 py-3 text-right font-bold text-neutral-200">{course.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}