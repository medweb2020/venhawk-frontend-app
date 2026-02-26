import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { projectAPI, vendorsAPI } from '../../../services/api';
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
const PROJECT_RECOMMENDATIONS_CACHE = new Map();
const PROJECT_RECOMMENDATIONS_IN_FLIGHT = new Map();
const PROJECT_RECOMMENDATIONS_CACHE_TTL_MS = 60 * 1000;
const VENDOR_LISTING_UI_STATE = {
  filters: createDefaultFilters(),
  searchInput: '',
  expandedFilterGroupKey: null,
  projectScopeKey: null,
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

const normalizeProjectId = (projectId) => {
  const parsed = Number(projectId);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export const useVendorListing = ({ projectId } = {}) => {
  const { getAccessTokenSilently } = useAuth0();
  const vendorsRequestRef = useRef(0);
  const filterOptionsRequestRef = useRef(0);

  const normalizedProjectId = useMemo(
    () => normalizeProjectId(projectId),
    [projectId],
  );
  const isProjectRecommendationMode = Boolean(normalizedProjectId);
  const projectScopeKey = useMemo(
    () => `project:${normalizedProjectId || 'none'}`,
    [normalizedProjectId],
  );

  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendationsMeta, setRecommendationsMeta] = useState(null);
  const [filters, setFilters] = useState(() =>
    normalizeFilterState(VENDOR_LISTING_UI_STATE.filters),
  );
  const [filterGroups, setFilterGroups] = useState([]);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  const [filterOptionsError, setFilterOptionsError] = useState('');
  const [expandedFilterGroupKey, setExpandedFilterGroupKey] = useState(
    () => VENDOR_LISTING_UI_STATE.expandedFilterGroupKey || null,
  );
  const projectScopeKeyRef = useRef(VENDOR_LISTING_UI_STATE.projectScopeKey);
  const [searchInput, setSearchInput] = useState(
    () => VENDOR_LISTING_UI_STATE.searchInput || '',
  );
  const [searchQuery, setSearchQuery] = useState(
    () => String(VENDOR_LISTING_UI_STATE.searchInput || '').trim(),
  );

  const normalizedFilters = useMemo(
    () => normalizeFilterState(filters),
    [filters],
  );

  const activeFilterCount = useMemo(() => {
    return Object.values(normalizedFilters).reduce(
      (count, values) => count + values.length,
      0,
    );
  }, [normalizedFilters]);

  const loadVendors = useCallback(async (isMounted = () => true) => {
    const requestId = ++vendorsRequestRef.current;
    setLoading(true);
    setError('');

    try {
      if (projectScopeKeyRef.current !== projectScopeKey) {
        if (isMounted() && requestId === vendorsRequestRef.current) {
          setAllVendors([]);
          setRecommendationsMeta(null);
        }
        return;
      }

      if (!isProjectRecommendationMode || !normalizedProjectId) {
        if (isMounted() && requestId === vendorsRequestRef.current) {
          setAllVendors([]);
          setRecommendationsMeta(null);
        }
        return;
      }

      const projectFilterKey = getFiltersCacheKey(normalizedFilters);
      const cacheKey = `project:${normalizedProjectId};filters:${projectFilterKey}`;
      let requestPromise;

      if (PROJECT_RECOMMENDATIONS_CACHE.has(cacheKey)) {
        const cached = PROJECT_RECOMMENDATIONS_CACHE.get(cacheKey);
        const isFresh =
          Date.now() - Number(cached?.cachedAt || 0) <
          PROJECT_RECOMMENDATIONS_CACHE_TTL_MS;

        if (!isFresh) {
          PROJECT_RECOMMENDATIONS_CACHE.delete(cacheKey);
        } else {
          if (isMounted() && requestId === vendorsRequestRef.current) {
            setAllVendors(cached.vendors);
            setRecommendationsMeta(cached.meta);
          }
          return;
        }
      }

      requestPromise = PROJECT_RECOMMENDATIONS_IN_FLIGHT.get(cacheKey);

      if (!requestPromise) {
        requestPromise = (async () => {
          const accessToken = await getAccessTokenSilently();
          const response = await projectAPI.getRecommendations(
            normalizedProjectId,
            accessToken,
            normalizedFilters,
          );

          return {
            vendors: Array.isArray(response?.recommendedVendors)
              ? response.recommendedVendors
              : [],
            meta: {
              projectId: response?.projectId || normalizedProjectId,
              computedAt: response?.computedAt || null,
              totalRecommended: Number(response?.totalRecommended || 0),
            },
          };
        })();

        PROJECT_RECOMMENDATIONS_IN_FLIGHT.set(cacheKey, requestPromise);
      }

      const recommendationResult = await requestPromise;
      PROJECT_RECOMMENDATIONS_CACHE.set(cacheKey, {
        ...recommendationResult,
        cachedAt: Date.now(),
      });

      if (isMounted() && requestId === vendorsRequestRef.current) {
        setAllVendors(recommendationResult.vendors);
        setRecommendationsMeta(recommendationResult.meta);
      }

      if (
        PROJECT_RECOMMENDATIONS_IN_FLIGHT.get(cacheKey) === requestPromise
      ) {
        PROJECT_RECOMMENDATIONS_IN_FLIGHT.delete(cacheKey);
      }
    } catch (err) {
      if (normalizedProjectId) {
        const projectFilterKey = getFiltersCacheKey(normalizedFilters);
        PROJECT_RECOMMENDATIONS_IN_FLIGHT.delete(
          `project:${normalizedProjectId};filters:${projectFilterKey}`,
        );
      }

      if (isMounted() && requestId === vendorsRequestRef.current) {
        setError(err.message || 'Failed to load vendors.');
        setAllVendors([]);
        setRecommendationsMeta(null);
      }
    } finally {
      if (isMounted() && requestId === vendorsRequestRef.current) {
        setLoading(false);
      }
    }
  }, [
    getAccessTokenSilently,
    isProjectRecommendationMode,
    normalizedFilters,
    normalizedProjectId,
    projectScopeKey,
  ]);

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

  const setExpandedGroup = useCallback((groupKey) => {
    setExpandedFilterGroupKey((prev) => {
      if (!groupKey) {
        return null;
      }

      return prev === groupKey ? null : groupKey;
    });
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

  useEffect(() => {
    const previousScope = projectScopeKeyRef.current;
    if (!previousScope) {
      projectScopeKeyRef.current = projectScopeKey;
      VENDOR_LISTING_UI_STATE.projectScopeKey = projectScopeKey;
      return;
    }

    if (previousScope === projectScopeKey) {
      return;
    }

    projectScopeKeyRef.current = projectScopeKey;
    VENDOR_LISTING_UI_STATE.projectScopeKey = projectScopeKey;
    VENDOR_LISTING_UI_STATE.filters = createDefaultFilters();
    VENDOR_LISTING_UI_STATE.searchInput = '';
    VENDOR_LISTING_UI_STATE.expandedFilterGroupKey = null;

    setFilters(createDefaultFilters());
    setSearchInput('');
    setSearchQuery('');
    setExpandedFilterGroupKey(null);
  }, [projectScopeKey]);

  useEffect(() => {
    VENDOR_LISTING_UI_STATE.expandedFilterGroupKey = expandedFilterGroupKey;
  }, [expandedFilterGroupKey]);

  return {
    vendors,
    allVendors,
    loading,
    error,
    isProjectRecommendationMode,
    projectId: normalizedProjectId,
    recommendationsMeta,
    filters: normalizedFilters,
    filterGroups,
    filterOptionsLoading,
    filterOptionsError,
    activeFilterCount,
    toggleFilterOption,
    clearFilters,
    expandedFilterGroupKey,
    setExpandedGroup,
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
