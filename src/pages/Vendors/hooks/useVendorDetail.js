import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';
import { vendorsAPI } from '../../../services/api';
import { preloadImages } from '../../../utils/imagePreload';

const VENDOR_DETAIL_CACHE = new Map();
const VENDOR_DETAIL_IN_FLIGHT = new Map();
const VENDOR_DETAIL_CACHE_TTL_MS = 5 * 60 * 1000;

const toInitials = (name) => {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return 'VC';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const normalizeKey = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const uniqueBy = (items, keySelector) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = keySelector(item);
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const getVendorDetailCacheKey = (vendorId, projectId) =>
  `vendor:${String(vendorId || '').trim()};project:${projectId ?? 'none'}`;

const getVendorDetailImageUrls = (vendor) => [
  vendor?.logoUrl,
  ...(Array.isArray(vendor?.keyClients)
    ? vendor.keyClients.map((client) => client?.logoSrc)
    : []),
];

const normalizeVendorDetailResponse = (response) => {
  const keyClients = Array.isArray(response?.keyClients) ? response.keyClients : [];
  const caseStudies = Array.isArray(response?.caseStudies) ? response.caseStudies : [];
  const reviews = Array.isArray(response?.reviews) ? response.reviews : [];

  return {
    ...(response || {}),
    keyClients: uniqueBy(keyClients.map((client, index) => ({
      id: client?.id || `client-${index + 1}`,
      label: String(client?.name || '').trim(),
      logoSrc: String(client?.logoUrl || '').trim() || null,
      websiteUrl: String(client?.websiteUrl || '').trim() || null,
      sourceName: String(client?.sourceName || '').trim() || null,
      sourceUrl: String(client?.sourceUrl || '').trim() || null,
    }))
      .filter((client) => String(client.label || '').trim().length > 1), (client) => normalizeKey(client.label)),
    caseStudies: uniqueBy(caseStudies.map((study, index) => ({
      id: study?.id || `case-study-${index + 1}`,
      title: String(study?.title || '').trim(),
      summary: String(study?.summary || '').trim(),
      studyUrl: String(study?.studyUrl || '').trim() || null,
      sourceName: String(study?.sourceName || '').trim() || null,
      sourceUrl: String(study?.sourceUrl || '').trim() || null,
    }))
      .filter((study) => String(study.title || '').trim().length > 0 && String(study.summary || '').trim().length > 0), (study) => normalizeKey(study.title)),
    reviews: uniqueBy(reviews.map((review, index) => {
      const author = String(review?.reviewerName || '').trim();
      const source = String(review?.source || '').trim();
      const role = String(review?.reviewerRole || '').trim();

      return {
        id: review?.id || `review-${index + 1}`,
        author,
        role: role || source || null,
        headline: String(review?.headline || '').trim(),
        quote: String(review?.quote || '').trim(),
        initials: toInitials(author),
        rating: Number(review?.rating || 0) || null,
        source: source || null,
        sourceUrl: String(review?.sourceUrl || '').trim() || null,
        publishedAt: review?.publishedAt || null,
      };
    })
      .filter((review) => String(review.author || '').trim().length > 0 && String(review.quote || '').trim().length > 0), (review) => `${normalizeKey(review.author)}::${normalizeKey(review.quote).slice(0, 180)}`),
  };
};

export const useVendorDetail = (vendorId, projectId = null) => {
  const { getAccessTokenSilently } = useAuth0();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadVendor = useCallback(async (isMounted = () => true, options = {}) => {
    const forceRefresh = options?.force === true;
    let requestPromise;

    if (!vendorId) {
      if (isMounted()) {
        setVendor(null);
        setError('Vendor not found.');
        setLoading(false);
      }
      return;
    }

    const cacheKey = getVendorDetailCacheKey(vendorId, projectId);
    const cachedEntry = VENDOR_DETAIL_CACHE.get(cacheKey);
    const isCachedEntryFresh = Boolean(cachedEntry)
      && Date.now() - Number(cachedEntry?.cachedAt || 0) < VENDOR_DETAIL_CACHE_TTL_MS;

    if (!forceRefresh && isCachedEntryFresh) {
      if (isMounted()) {
        setVendor(cachedEntry.vendor);
        setError('');
        setLoading(false);
      }
      return;
    }

    if (cachedEntry && !isCachedEntryFresh) {
      VENDOR_DETAIL_CACHE.delete(cacheKey);
    }

    if (isMounted()) {
      setLoading(true);
      setError('');
    }

    try {
      requestPromise = forceRefresh
        ? null
        : VENDOR_DETAIL_IN_FLIGHT.get(cacheKey);

      if (!requestPromise) {
        requestPromise = (async () => {
          const accessToken = await getAccessTokenSilently();
          const response = await vendorsAPI.getVendorDetail(vendorId, accessToken, {
            projectId,
          });
          const normalizedResponse = normalizeVendorDetailResponse(response);
          await preloadImages(getVendorDetailImageUrls(normalizedResponse), {
            timeoutMs: 7000,
          });

          return normalizedResponse;
        })();

        VENDOR_DETAIL_IN_FLIGHT.set(cacheKey, requestPromise);
      }

      const normalizedResponse = await requestPromise;
      VENDOR_DETAIL_CACHE.set(cacheKey, {
        vendor: normalizedResponse,
        cachedAt: Date.now(),
      });

      if (isMounted()) {
        setVendor(normalizedResponse);
      }
    } catch (err) {
      if (VENDOR_DETAIL_IN_FLIGHT.get(cacheKey) === requestPromise) {
        VENDOR_DETAIL_IN_FLIGHT.delete(cacheKey);
      }
      if (isMounted()) {
        setVendor(null);
        setError(err.message || 'Failed to load vendor details.');
      }
    } finally {
      if (VENDOR_DETAIL_IN_FLIGHT.get(cacheKey) === requestPromise) {
        VENDOR_DETAIL_IN_FLIGHT.delete(cacheKey);
      }

      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [getAccessTokenSilently, projectId, vendorId]);

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
    reload: () => loadVendor(() => true, { force: true }),
  };
};

export default useVendorDetail;
