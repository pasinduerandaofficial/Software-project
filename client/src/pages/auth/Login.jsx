import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Compass, Lock, User, ShieldCheck, MapPin } from 'lucide-react';
import logo from '../../assets/logo.png';
import facultyLogo from '../../assets/faculty_logo.png';

export default function Login() {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(regNo, password);
    
    if (result.success) {
      if (result.role === 'admin' && result.department) {
        navigate('/admin/dashboard');
      } else {
        navigate('/select-office');
      }
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex relative overflow-hidden text-neutral-200 font-sans">
      
      {/* Background Decorative Elements (Topographic / Glow) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[100px]"></div>
        {/* Subtle grid overlay to represent geomatics/coordinates */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen p-6 lg:p-12 gap-12 lg:gap-24">
        
        {/* Left Side - Welcome & Mission */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl">
          
          {/* Logos Section (First priority) */}
          <div className="flex flex-row items-center gap-8 mb-8">
            <img 
              src={logo} 
              alt="University Logo" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] brightness-0 invert transition-all duration-300 hover:scale-105"
            />
            <img 
              src={facultyLogo} 
              alt="Faculty Logo" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* University Tag */}
          <div className="mb-6 inline-flex items-center gap-3 bg-neutral-900/60 border border-neutral-700/50 backdrop-blur-md px-4 py-2 rounded-full w-max shadow-lg shadow-black/40">
            <MapPin className="text-orange-500" size={16} />
            <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-neutral-300">Sabaragamuwa University of Sri Lanka</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tighter">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600">
              Geo Offices
            </span>
          </h1>
          
          {/* Mission Statement */}
          <p className="text-base md:text-lg text-neutral-400 mb-8 leading-relaxed max-w-lg text-justify font-light">
            Empowering surveying and geomatics undergraduates, academic staff, and faculty administration with a unified digital workspace for real-time lecture schedules, continuous assessments, and academic operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 text-neutral-300 bg-neutral-900/40 px-4 py-3 rounded-lg border border-neutral-800/60 backdrop-blur-sm">
              <ShieldCheck className="text-blue-500" size={20} />
              <span className="text-sm font-medium">Secure Academic Gateway</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300 bg-neutral-900/40 px-4 py-3 rounded-lg border border-neutral-800/60 backdrop-blur-sm">
              <MapPin className="text-emerald-500" size={20} />
              <span className="text-sm font-medium">Faculty of Geomatics</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Card */}
        <div className="w-full lg:w-5/12 max-w-md">
          <div className="bg-neutral-900/70 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
              <p className="text-neutral-400 text-sm">Access your portal dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-950/50 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-200 text-sm">
                <ShieldCheck size={18} className="text-red-500 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Registration Number / Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
                    placeholder="e.g. EG/2021/4000"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 bg-neutral-950/60 text-orange-500 focus:ring-orange-500 focus:ring-offset-neutral-900 transition-all" 
                  />
                  <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Remember me</span>
                </label>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert("Please contact the IT Helpdesk to reset your password."); }}
                  className="text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-orange-900/20 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-800/60 text-center">
              <p className="text-xs text-neutral-500">
                &copy; {new Date().getFullYear()} Faculty of Geomatics. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}