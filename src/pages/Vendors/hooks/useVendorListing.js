import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';
import { vendorsAPI } from '../../../services/api';

export const useVendorListing = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadVendors = useCallback(async (isMounted = () => true) => {
    setLoading(true);
    setError('');

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await vendorsAPI.getListing(accessToken);
      if (isMounted()) {
        setVendors(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      if (isMounted()) {
        setError(err.message || 'Failed to load vendors.');
        setVendors([]);
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    let isMounted = true;

    loadVendors(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [loadVendors]);

  return {
    vendors,
    loading,
    error,
    reload: loadVendors,
  };
};

export default useVendorListing;
