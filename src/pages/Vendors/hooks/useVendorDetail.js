import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';
import { vendorsAPI } from '../../../services/api';

export const useVendorDetail = (vendorId) => {
  const { getAccessTokenSilently } = useAuth0();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadVendor = useCallback(async (isMounted = () => true) => {
    if (!vendorId) {
      if (isMounted()) {
        setVendor(null);
        setError('Vendor not found.');
        setLoading(false);
      }
      return;
    }

    if (isMounted()) {
      setLoading(true);
      setError('');
    }

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await vendorsAPI.getListingVendor(vendorId, accessToken);

      if (isMounted()) {
        setVendor(response || null);
      }
    } catch (err) {
      if (isMounted()) {
        setVendor(null);
        setError(err.message || 'Failed to load vendor details.');
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [getAccessTokenSilently, vendorId]);

  useEffect(() => {
    let isMounted = true;

    loadVendor(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [loadVendor]);

  return {
    vendor,
    loading,
    error,
    reload: loadVendor,
  };
};

export default useVendorDetail;
