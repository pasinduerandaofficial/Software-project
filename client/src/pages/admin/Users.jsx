import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, X, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user: currentUser } = useAuth();
  
  const isSystemAdmin = currentUser?.role === 'admin' && !currentUser?.department;

  const [formData, setFormData] = useState({
    regNo: '',
    name: '',
    password: '',
    role: 'student',
    department: ''
  });

  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    regNo: '',
    name: '',
    role: '',
    department: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (dataToSend.role !== 'admin') {
         dataToSend.department = null;
      }
      
      await axios.post('/api/users', dataToSend);
      setShowForm(false);
      setFormData({ regNo: '', name: '', password: '', role: 'student', department: '' });
      fetchUsers(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...editFormData };
      if (dataToSend.role !== 'admin' && dataToSend.role !== 'student') { // Let's just pass what they typed, or force null if needed. Actually we want them to update student's dept for the format right? Oh right, students don't use the 'department' column right now? The users table has 'department'. The system allows department for students if they want, but our original logic set it to null. Let's just pass whatever they select.
        // Wait, for index numbers parsing, we just use the index number `21GES...` to get the department.
        // If we want to assign department directly, let's allow it for everyone.
      }

      await axios.put(`/api/users/${editingUser.id}`, dataToSend);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user');
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      regNo: user.reg_no,
      name: user.name,
      role: user.role,
      department: user.department || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-neutral-400">Manage student, lecturer, and administrator accounts.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          {showForm ? <X size={18} /> : <UserPlus size={18} />} 
          {showForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showForm && (
        <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Create New User</h3>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Reg No / Username" 
              className="px-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500" 
              value={formData.regNo} 
              onChange={e => setFormData({...formData, regNo: e.target.value})} 
              required 
            />
            <input 
              type="text" 
              placeholder="Full Name" 
              className="px-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="px-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required 
            />
            
            <div className="flex gap-4">
              <select 
                className="flex-1 px-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 focus:outline-none focus:border-orange-500" 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                {isSystemAdmin && <option value="admin">Admin</option>}
              </select>

              {formData.role === 'admin' && (
                <select 
                  className="flex-1 px-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 focus:outline-none focus:border-orange-500" 
                  value={formData.department} 
                  onChange={e => setFormData({...formData, department: e.target.value})}
                >
                  <option value="">System Admin</option>
                  <option value="SUGEO">SUGEO Admin</option>
                  <option value="RS_GIS">RS & GIS Admin</option>
                </select>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition-all">
                Save User
              </button>
            </div>
          </form>
          
          {!isSystemAdmin && formData.role === 'admin' && (
             <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex gap-3 text-red-400 text-sm">
                <ShieldAlert size={20} className="flex-shrink-0" />
                <p>Only the System Admin can create other Admin accounts.</p>
             </div>
          )}
        </div>
      )}

      <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-950/50 border-b border-neutral-800/80 text-neutral-400 text-sm font-medium uppercase tracking-wider">
              <tr>
                <th className="p-4">Reg No</th>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-neutral-200">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-neutral-500 animate-pulse">Loading users...</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                  <td className="p-4 font-medium">{user.reg_no}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      user.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      user.role === 'lecturer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.department ? (
                      <span className="text-neutral-400 text-sm">{user.department}</span>
                    ) : user.role === 'admin' ? (
                      <span className="text-orange-400 text-sm font-medium">System</span>
                    ) : (
                      <span className="text-neutral-600 text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4 text-neutral-500 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => openEdit(user)} 
                      className="p-2 text-neutral-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <UserPlus size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr><td colSpan="6" className="p-8 text-center text-neutral-500">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-neutral-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Reg No / Username</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 focus:outline-none focus:border-blue-500" 
                  value={editFormData.regNo} 
                  onChange={e => setEditFormData({...editFormData, regNo: e.target.value})} 
                  required 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 focus:outline-none focus:border-blue-500" 
                  value={editFormData.name} 
                  onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Role</label>
                  <select 
                    className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 focus:outline-none focus:border-blue-500" 
                    value={editFormData.role} 
                    onChange={e => setEditFormData({...editFormData, role: e.target.value})}
                  >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                    {isSystemAdmin && <option value="admin">Admin</option>}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Department</label>
                  <select 
                    className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-700/80 rounded-xl text-neutral-200 focus:outline-none focus:border-blue-500" 
                    value={editFormData.department} 
                    onChange={e => setEditFormData({...editFormData, department: e.target.value})}
                  >
                    <option value="">None / System</option>
                    <option value="SUGEO">SUGEO</option>
                    <option value="RS_GIS">RS_GIS</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}