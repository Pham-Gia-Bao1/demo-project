// src/hooks/useAuthInitializer.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkUserSession } from '../services/authService.ts';
import { Dispatch } from 'redux';

const useAuthInitializer: () => void = () => {
  const dispatch: Dispatch = useDispatch();

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
