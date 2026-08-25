import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AUTH_STORAGE_KEY } from '@/constants';
import { apiClient } from '@/api';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Backend logout failed or session already cleared', err);
    } finally {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    async function fetchSession() {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return;
      try {
        const response = await apiClient.get('/auth/me');
        if (response.success && response.data) {
          const parsed = JSON.parse(raw);
          const updated = { ...parsed, user: response.data };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
          setUser(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch user session:', err);
        if (err.code === 'UNAUTHORIZED' || err.status === 401) {
          logout();
        }
      }
    }
    fetchSession();

    // Listen for session expiry event from apiClient
    const handleExpired = () => {
      logout();
    };
    window.addEventListener('auth_session_expired', handleExpired);
    return () => {
      window.removeEventListener('auth_session_expired', handleExpired);
    };
  }, [logout]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.success && response.data) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data));
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid email or password' };
    }
  }, []);

  const registerSeeker = useCallback(async (data) => {
    try {
      const response = await apiClient.post('/auth/register/seeker', data);
      return { success: true, message: response.message || 'Registration successful' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  }, []);

  const registerEmployer = useCallback(async (data) => {
    try {
      const response = await apiClient.post('/auth/register/employer', data);
      return { success: true, message: response.message || 'Registration successful' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      registerSeeker,
      registerEmployer,
    }),
    [user, login, logout, registerSeeker, registerEmployer],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;

