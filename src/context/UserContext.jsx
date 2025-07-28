import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../utils/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));
  const [error, setError] = useState(null);

  // Token setter that syncs with localStorage
  const setToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  // Fetch user profile
  const refreshUser = async () => {
    setLoading(true);
    setError(null);
    if (token) {
      try {
        const profile = await fetchUserProfile(token);
        setUser(profile);
      } catch (e) {
        setUser(null);
        setError('Failed to fetch user profile.');
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
        error,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
