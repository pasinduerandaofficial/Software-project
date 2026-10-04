import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Clock, Circle, Upload, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentSubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`/api/submissions/my-submissions`);
        setSubmissions(res.data);
      } catch (err) {
        console.error('Error fetching submissions', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
    
    // Poll every 3 seconds for instant updates
    intervalId = setInterval(fetchSubmissions, 3000);
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'evaluated':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold tracking-wide border border-emerald-500/20">
            <CheckCircle2 size={14} /> EVALUATED
          </div>
        );
      case 'submitted':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold tracking-wide border border-blue-500/20">
            <Clock size={14} /> SUBMITTED
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-bold tracking-wide border border-orange-500/20">
            <Circle size={14} /> PENDING SUBMISSION
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full font-sans pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Submission Checklist</h1>
        <p className="text-neutral-400">
          Track your required submissions and evaluation status.
        </p>
      </div>

      {/* Content Area */}
      <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-teal-400"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl font-semibold text-neutral-200">
            Submission Checklist
          </h2>
        </div>

        {/* Workflow Items */}
        <div className="flex flex-col gap-4">
          
          {loading ? (
            <div className="text-neutral-500 animate-pulse text-center p-8">Loading your checklist...</div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-neutral-500 bg-neutral-950/50 border border-neutral-800/50 rounded-2xl border-dashed">
              <CheckCircle2 size={48} className="mb-4 opacity-20" />
              <p>No submission requirements found.</p>
            </div>
          ) : (
            submissions.map((sub) => (
              <div key={sub.record_id} className={`bg-neutral-950/80 border ${sub.status === 'pending' ? 'border-orange-500/30' : 'border-neutral-800'} p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between hover:border-neutral-700 transition-colors group relative overflow-hidden`}>
                
                {/* Pending indicator pulse */}
                {sub.status === 'pending' && (
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                )}

                <div className="flex items-start gap-4 mb-4 md:mb-0">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    sub.status === 'evaluated' ? 'bg-emerald-500/10 text-emerald-400' :
                    sub.status === 'submitted' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-orange-500/10 text-orange-400'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="text-neutral-200 font-bold text-lg">{sub.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase tracking-wider">{sub.course_code}</span>
                      {sub.submitted_at && (
                        <span className="text-neutral-500 text-sm flex items-center gap-1">
                          <Clock size={12} /> {new Date(sub.submitted_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3 ml-16 md:ml-0">
                  {getStatusDisplay(sub.status)}
                  
                  {sub.status === 'pending' && (
                    <button className="flex items-center gap-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg transition-colors">
                      <Upload size={14} /> Submit Hardcopy
                    </button>
                  )}
                </div>

              </div>
            ))
          )}

        </div>

        {submissions.length > 0 && !loading && (
          <div className="mt-8 p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl flex items-start gap-3 text-blue-400 text-sm">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p>
              Please hand over your physical documents directly to the department office. The administrator will instantly verify and update your digital submission status here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
