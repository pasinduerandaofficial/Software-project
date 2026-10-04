import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage on initial load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedDept = localStorage.getItem('selected_department');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Set default header for all subsequent API requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    if (storedDept) {
      setSelectedDepartment(storedDept);
    }
    
    setLoading(false);
  }, []);

  const login = async (regNo, password) => {
    try {
      const response = await axios.post('/api/auth/login', { regNo, password });
      const { token, user } = response.data;

      // Save to state
      setUser(user);
      
      // Save to localStorage so user stays logged in after refresh
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Attach JWT token to axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Automatically set department if assigned (e.g. for specific admins)
      if (user.department) {
        setSelectedDepartment(user.department);
        localStorage.setItem('selected_department', user.department);
      }
      
      return { success: true, role: user.role, department: user.department };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Check your credentials.' 
      };
    }
  };
  
  const setDepartment = (dept) => {
    setSelectedDepartment(dept);
    localStorage.setItem('selected_department', dept);
  };

  const logout = () => {
    setUser(null);
    setSelectedDepartment(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selected_department');
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, selectedDepartment, setDepartment }}>
      {children}
    </AuthContext.Provider>
  );
};
