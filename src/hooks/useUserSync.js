import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { userAPI } from '../services/api';

/**
 * Custom hook to sync Auth0 user with backend
 * Automatically syncs user data when authenticated
 */
export const useUserSync = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsSyncing(true);
        setSyncError(null);

        // Get access token
        const accessToken = await getAccessTokenSilently();

        // Sync user data with backend
        const userData = {
          sub: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture,
        };

        await userAPI.syncUser(userData, accessToken);
      } catch (error) {
        setSyncError(error.message || 'Failed to sync user data');
      } finally {
        setIsSyncing(false);
      }
    };

    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return { isSyncing, syncError };
};
