// src/hooks/useAuthInitializer.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkUserSession } from '../services/authService';

const useAuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkUserSession(dispatch);
      } catch (error) {
        console.error('Failed to check session:', error);
      }
    };

    initializeAuth();
  }, [dispatch]);
};

export default useAuthInitializer;
