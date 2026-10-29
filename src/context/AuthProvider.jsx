import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext.js';
import { authApi } from '../api/endpoints.js';
import { clearTokens, setAuthFailureHandler, setTokens } from '../api/client.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // redirect to the login page if session failed
  useEffect(() => {
    setAuthFailureHandler(() => setUser(null));
    return () => setAuthFailureHandler(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const tokens = await authApi.login(email, password);
    setTokens(tokens.access_token, tokens.refresh_token);
    try {
      setUser(await authApi.me());
    } catch (err) {
      
      clearTokens();
      throw err;
    }
  }, []);

  const register = useCallback(
    async (details) => {
      await authApi.register(details);
      await login(details.email, details.password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout(); // tell the server to invalidate the refresh token
    } catch {
    }
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}