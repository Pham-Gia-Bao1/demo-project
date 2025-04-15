import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, signupUser, logoutUser, checkUserSession } from '../services/authService.ts';
import authSlice from "../store/authSlice";

type Credentials = {
  email: string;
  password: string;
};

type UseAuthHandlersReturn = {
  showLoginForm: boolean;
  credentials: Credentials;
  loading: boolean;
  error: string | null;
  toggleLoginForm: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleSignup: () => Promise<void>;
  handleLogout: () => Promise<void>;
};

const useAuthHandlers = (): UseAuthHandlersReturn => {
  const dispatch = useDispatch();

  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const user = await checkUserSession(dispatch);
        if (user) {
          console.log('Session restored:', user);
        } else {
          console.log('No active session found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initialize session');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  const toggleLoginForm = useCallback(() => {
    setShowLoginForm((prev) => !prev);
    setError(null);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginUser(credentials.email, credentials.password, dispatch);
      setShowLoginForm(false);
      setCredentials({ email: '', password: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      await signupUser('newuser@example.com', 'password123', dispatch);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser(dispatch);
      // dispatch(authSlice.actions.logout());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    showLoginForm,
    credentials,
    loading,
    error,
    toggleLoginForm,
    handleChange,
    handleLogin,
    handleSignup,
    handleLogout,
  };
};

export default useAuthHandlers;