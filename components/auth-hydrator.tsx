'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUser, setToken } from '@/lib/redux-store';
import { cacheStorage } from '@/lib/cache-storage';

export function AuthHydrator() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!token || !user) {
      const localToken = localStorage.getItem('token');
      const localUserRaw = localStorage.getItem('user');

      const cachedToken = cacheStorage.getToken();
      const cachedUser = cacheStorage.getUser();

      const finalToken = localToken || cachedToken;
      const finalUser = localUserRaw ? JSON.parse(localUserRaw) : cachedUser;

      if (finalToken && finalUser) {
        dispatch(setToken(finalToken));
        dispatch(setUser(finalUser));
      }
    }
  }, [dispatch, token, user]);

  return null;
}

