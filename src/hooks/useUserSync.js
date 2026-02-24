import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { userAPI } from '../services/api';

const syncedUsers = new Set();
const syncingUsers = new Set();

/**
 * Custom hook to sync Auth0 user with backend
 * Automatically syncs user data when authenticated
 */
export const useUserSync = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const syncedUserIdRef = useRef('');
  const syncInFlightRef = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      const userId = user?.sub || '';

      if (!isAuthenticated || !userId) {
        return;
      }

      if (
        syncedUsers.has(userId) ||
        syncingUsers.has(userId) ||
        syncedUserIdRef.current === userId ||
        syncInFlightRef.current
      ) {
        return;
      }

      try {
        syncInFlightRef.current = true;
        syncingUsers.add(userId);
        setIsSyncing(true);
        setSyncError(null);

        // Get access token
        const accessToken = await getAccessTokenSilently();

        // Sync user data with backend
        const userData = {
          sub: userId,
          email: user.email,
          name: user.name,
          picture: user.picture,
        };

        await userAPI.syncUser(userData, accessToken);
        syncedUsers.add(userId);
        syncedUserIdRef.current = userId;
      } catch (error) {
        setSyncError(error.message || 'Failed to sync user data');
      } finally {
        syncingUsers.delete(userId);
        syncInFlightRef.current = false;
        setIsSyncing(false);
      }
    };

    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return { isSyncing, syncError };
};
