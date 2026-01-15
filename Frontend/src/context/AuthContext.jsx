import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth state from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const storedTokens = localStorage.getItem('tokens');
    
    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
    }
    setLoading(false);
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokens', JSON.stringify(tokenData));
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
  };

  const updateTokens = (newTokens) => {
    setTokens(newTokens);
    localStorage.setItem('tokens', JSON.stringify(newTokens));
  };

  const value = {
    user,
    tokens,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
