import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/services';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const s = localStorage.getItem('scarr_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) localStorage.setItem('scarr_user', JSON.stringify(currentUser));
    else localStorage.removeItem('scarr_user');
  }, [currentUser]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login(credentials);
      // Handle both response shapes: { data: { user, accessToken } } or { data: {...userObj} }
      const user = data?.data?.user || data?.data || data;
      setCurrentUser(user);
      toast.success('Welcome back.');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      await authAPI.register(userData);
      toast.success('Account created. Please sign in.');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch { /* fail silently */ }
    finally {
      setCurrentUser(null);
      localStorage.removeItem('scarr_user');
      toast.success('Signed out.');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;