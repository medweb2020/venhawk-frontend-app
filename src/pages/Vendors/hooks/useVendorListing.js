import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { vendorsAPI } from '../../../services/api';

const createDefaultFilters = () => ({
  coreCapabilities: [],
  industryExperience: [],
  startTimeline: [],
  verifiedCertifications: [],
  clientValidation: [],
});

const normalizeFilterState = (filters) => {
  return Object.entries(filters || {}).reduce((acc, [key, values]) => {
    if (!Array.isArray(values)) {
      return acc;
    }

    acc[key] = Array.from(
      new Set(
        values
          .map((value) => String(value).trim())
          .filter(Boolean),
      ),
    );

    return acc;
  }, createDefaultFilters());
};

export const useVendorListing = () => {
  const { getAccessTokenSilently } = useAuth0();
  const vendorsRequestRef = useRef(0);
  const filterOptionsRequestRef = useRef(0);

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(createDefaultFilters);
  const [filterGroups, setFilterGroups] = useState([]);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  const [filterOptionsError, setFilterOptionsError] = useState('');

  const normalizedFilters = useMemo(() => normalizeFilterState(filters), [filters]);

  const activeFilterCount = useMemo(
    () => Object.values(normalizedFilters).reduce((count, values) => count + values.length, 0),
    [normalizedFilters],
  );

  const loadVendors = useCallback(async (isMounted = () => true) => {
    const requestId = ++vendorsRequestRef.current;
    setLoading(true);
    setError('');

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await vendorsAPI.getListing(accessToken, normalizedFilters);

      if (isMounted() && requestId === vendorsRequestRef.current) {
        setVendors(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      if (isMounted() && requestId === vendorsRequestRef.current) {
        setError(err.message || 'Failed to load vendors.');
        setVendors([]);
      }
    } finally {
      if (isMounted() && requestId === vendorsRequestRef.current) {
        setLoading(false);
      }
    }
  }, [getAccessTokenSilently, normalizedFilters]);

  const loadFilterOptions = useCallback(async (isMounted = () => true) => {
    const requestId = ++filterOptionsRequestRef.current;
    setFilterOptionsLoading(true);
    setFilterOptionsError('');

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await vendorsAPI.getListingFilters(accessToken);
      const groups = Array.isArray(response?.groups) ? response.groups : [];

      if (isMounted() && requestId === filterOptionsRequestRef.current) {
        setFilterGroups(groups);
      }
    } catch (err) {
      if (isMounted() && requestId === filterOptionsRequestRef.current) {
        setFilterGroups([]);
        setFilterOptionsError(err.message || 'Failed to load filter options.');
      }
    } finally {
      if (isMounted() && requestId === filterOptionsRequestRef.current) {
        setFilterOptionsLoading(false);
      }
    }
  }, [getAccessTokenSilently]);

  const toggleFilterOption = useCallback((groupKey, optionValue) => {
    setFilters((prev) => {
      const currentValues = Array.isArray(prev[groupKey]) ? prev[groupKey] : [];
      const alreadySelected = currentValues.includes(optionValue);

      return {
        ...prev,
        [groupKey]: alreadySelected
          ? currentValues.filter((value) => value !== optionValue)
          : [...currentValues, optionValue],
      };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(createDefaultFilters());
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadFilterOptions(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [loadFilterOptions]);

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
    filters: normalizedFilters,
    filterGroups,
    filterOptionsLoading,
    filterOptionsError,
    activeFilterCount,
    toggleFilterOption,
    clearFilters,
    reload: loadVendors,
    reloadFilterOptions: loadFilterOptions,
  };
};

export default useVendorListing;
