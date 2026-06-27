import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  AUTH_STORAGE_KEY,
  DUMMY_COMPANY,
  DUMMY_USER,
} from '@/constants';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function findMatchingAccount(email, password) {
  if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
    return DUMMY_USER;
  }

  if (email === DUMMY_COMPANY.email && password === DUMMY_COMPANY.password) {
    return DUMMY_COMPANY;
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const login = useCallback((email, password) => {
    const account = findMatchingAccount(email, password);

    if (account) {
      const sessionUser = {
        email: account.email,
        name: account.name,
        firstName: account.firstName,
        role: account.role,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true };
    }

    return { success: false, message: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
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
