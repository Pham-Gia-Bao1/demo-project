import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, signupUser, logoutUser, checkUserSession } from '../services/authService';
import { logout } from '../store/authSlice';

const useAuthHandlers = () => {
  const dispatch = useDispatch();

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      } catch (err) {
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginUser(credentials.email, credentials.password, dispatch);
      setShowLoginForm(false);
      setCredentials({ email: '', password: '' });
    } catch (err) {
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
    } catch (err) {
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
      dispatch(logout());
    } catch (err) {
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