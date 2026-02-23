import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { vendorsAPI } from '../../../services/api';
import { searchVendors } from '../search/vendorSearchEngine';

const LISTING_DEBOUNCE_MS = 180;
const SEARCH_INPUT_DEBOUNCE_MS = 140;

const createDefaultFilters = () => ({
  coreCapabilities: [],
  industryExperience: [],
  startTimeline: [],
  verifiedCertifications: [],
  clientValidation: [],
});

const FILTER_GROUP_OPTIONS_CACHE = {
  groups: null,
};

let filterGroupsInFlightPromise = null;
const VENDOR_LISTING_CACHE = new Map();
const VENDOR_LISTING_IN_FLIGHT = new Map();
const VENDOR_LISTING_UI_STATE = {
  filters: createDefaultFilters(),
  searchInput: '',
};

const getFiltersCacheKey = (filters) => {
  const orderedKeys = Object.keys(createDefaultFilters());

  return orderedKeys
    .map((key) => {
      const values = Array.isArray(filters?.[key]) ? [...filters[key]] : [];
      values.sort();
      return `${key}:${values.join('|')}`;
    })
    .join(';');
};

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

  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(() =>
    normalizeFilterState(VENDOR_LISTING_UI_STATE.filters),
  );
  const [filterGroups, setFilterGroups] = useState([]);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  const [filterOptionsError, setFilterOptionsError] = useState('');
  const [searchInput, setSearchInput] = useState(
    () => VENDOR_LISTING_UI_STATE.searchInput || '',
  );
  const [searchQuery, setSearchQuery] = useState(
    () => String(VENDOR_LISTING_UI_STATE.searchInput || '').trim(),
  );

  const normalizedFilters = useMemo(() => normalizeFilterState(filters), [filters]);

  const activeFilterCount = useMemo(
    () => Object.values(normalizedFilters).reduce((count, values) => count + values.length, 0),
    [normalizedFilters],
  );

  const loadVendors = useCallback(async (isMounted = () => true) => {
    const requestId = ++vendorsRequestRef.current;
    const cacheKey = getFiltersCacheKey(normalizedFilters);
    let requestPromise;

    setLoading(true);
    setError('');

    try {
      if (VENDOR_LISTING_CACHE.has(cacheKey)) {
        if (isMounted() && requestId === vendorsRequestRef.current) {
          setAllVendors(VENDOR_LISTING_CACHE.get(cacheKey));
        }
        return;
      }

      requestPromise = VENDOR_LISTING_IN_FLIGHT.get(cacheKey);

      if (!requestPromise) {
        requestPromise = (async () => {
          const accessToken = await getAccessTokenSilently();
          const response = await vendorsAPI.getListing(accessToken, normalizedFilters);
          return Array.isArray(response) ? response : [];
        })();

        VENDOR_LISTING_IN_FLIGHT.set(cacheKey, requestPromise);
      }

      const vendorResults = await requestPromise;
      VENDOR_LISTING_CACHE.set(cacheKey, vendorResults);

      if (isMounted() && requestId === vendorsRequestRef.current) {
        setAllVendors(vendorResults);
      }
    } catch (err) {
      if (isMounted() && requestId === vendorsRequestRef.current) {
        setError(err.message || 'Failed to load vendors.');
        setAllVendors([]);
      }
    } finally {
      if (
        requestPromise &&
        VENDOR_LISTING_IN_FLIGHT.get(cacheKey) === requestPromise
      ) {
        VENDOR_LISTING_IN_FLIGHT.delete(cacheKey);
      }

      if (isMounted() && requestId === vendorsRequestRef.current) {
        setLoading(false);
      }
    }
  }, [getAccessTokenSilently, normalizedFilters]);

  const loadFilterOptions = useCallback(async (isMounted = () => true) => {
    const requestId = ++filterOptionsRequestRef.current;
    let requestPromise;

    setFilterOptionsLoading(true);
    setFilterOptionsError('');

    try {
      if (Array.isArray(FILTER_GROUP_OPTIONS_CACHE.groups)) {
        if (isMounted() && requestId === filterOptionsRequestRef.current) {
          setFilterGroups(FILTER_GROUP_OPTIONS_CACHE.groups);
        }
        return;
      }

      requestPromise = filterGroupsInFlightPromise;

      if (!requestPromise) {
        requestPromise = (async () => {
          const accessToken = await getAccessTokenSilently();
          const response = await vendorsAPI.getListingFilters(accessToken);
          return Array.isArray(response?.groups) ? response.groups : [];
        })();

        filterGroupsInFlightPromise = requestPromise;
      }

      const groups = await requestPromise;
      FILTER_GROUP_OPTIONS_CACHE.groups = groups;

      if (isMounted() && requestId === filterOptionsRequestRef.current) {
        setFilterGroups(groups);
      }
    } catch (err) {
      if (isMounted() && requestId === filterOptionsRequestRef.current) {
        setFilterGroups([]);
        setFilterOptionsError(err.message || 'Failed to load filter options.');
      }
    } finally {
      if (requestPromise && filterGroupsInFlightPromise === requestPromise) {
        filterGroupsInFlightPromise = null;
      }

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

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
  }, []);

  const vendors = useMemo(() => {
    return searchVendors({
      vendors: allVendors,
      query: searchQuery,
    });
  }, [allVendors, searchQuery]);

  const hasSearchQuery = searchQuery.length > 0;

  useEffect(() => {
    let isMounted = true;
    loadFilterOptions(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [loadFilterOptions]);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = globalThis.setTimeout(() => {
      loadVendors(() => isMounted);
    }, LISTING_DEBOUNCE_MS);

    return () => {
      isMounted = false;
      globalThis.clearTimeout(timeoutId);
    };
  }, [loadVendors]);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, SEARCH_INPUT_DEBOUNCE_MS);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {
    VENDOR_LISTING_UI_STATE.filters = normalizedFilters;
  }, [normalizedFilters]);

  useEffect(() => {
    VENDOR_LISTING_UI_STATE.searchInput = searchInput;
  }, [searchInput]);

  return {
    vendors,
    allVendors,
    loading,
    error,
    filters: normalizedFilters,
    filterGroups,
    filterOptionsLoading,
    filterOptionsError,
    activeFilterCount,
    toggleFilterOption,
    clearFilters,
    searchInput,
    searchQuery,
    hasSearchQuery,
    setSearchInput,
    clearSearch,
    reload: loadVendors,
    reloadFilterOptions: loadFilterOptions,
  };
};

export default useVendorListing;
