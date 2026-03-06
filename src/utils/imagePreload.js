import { useEffect, useMemo, useState } from 'react';

const LOADED_IMAGE_URLS = new Set();
const FAILED_IMAGE_URLS = new Set();
const IN_FLIGHT_IMAGE_REQUESTS = new Map();
const DEFAULT_IMAGE_TIMEOUT_MS = 7000;

const normalizeUrls = (urls) =>
  Array.from(
    new Set(
      (Array.isArray(urls) ? urls : [urls])
        .map((value) => String(value || '').trim())
        .filter(Boolean),
    ),
  );

export const getImagePreloadStatus = (url) => {
  const normalizedUrl = String(url || '').trim();

  if (!normalizedUrl) {
    return 'empty';
  }

  if (LOADED_IMAGE_URLS.has(normalizedUrl)) {
    return 'loaded';
  }

  if (FAILED_IMAGE_URLS.has(normalizedUrl)) {
    return 'error';
  }

  return 'idle';
};

const loadImage = (url, timeoutMs = DEFAULT_IMAGE_TIMEOUT_MS) =>
  new Promise((resolve) => {
    const image = new Image();
    let settled = false;

    const finalize = (status) => {
      if (settled) {
        return;
      }

      settled = true;
      globalThis.clearTimeout(timeoutId);
      image.onload = null;
      image.onerror = null;
      resolve(status);
    };

    const timeoutId = globalThis.setTimeout(() => finalize('error'), timeoutMs);

    image.onload = async () => {
      if (typeof image.decode === 'function') {
        try {
          await image.decode();
        } catch {
          // Decoding failures should not block display once the browser has loaded the asset.
        }
      }

      finalize('loaded');
    };

    image.onerror = () => finalize('error');
    image.decoding = 'async';
    image.referrerPolicy = 'no-referrer';
    image.src = url;
  });

export const preloadImage = async (url, options = {}) => {
  const normalizedUrl = String(url || '').trim();
  const timeoutMs = Number(options?.timeoutMs) || DEFAULT_IMAGE_TIMEOUT_MS;

  if (!normalizedUrl) {
    return 'empty';
  }

  const existingStatus = getImagePreloadStatus(normalizedUrl);
  if (existingStatus === 'loaded' || existingStatus === 'error') {
    return existingStatus;
  }

  if (IN_FLIGHT_IMAGE_REQUESTS.has(normalizedUrl)) {
    return IN_FLIGHT_IMAGE_REQUESTS.get(normalizedUrl);
  }

  const requestPromise = loadImage(normalizedUrl, timeoutMs).then((status) => {
    IN_FLIGHT_IMAGE_REQUESTS.delete(normalizedUrl);

    if (status === 'loaded') {
      LOADED_IMAGE_URLS.add(normalizedUrl);
      FAILED_IMAGE_URLS.delete(normalizedUrl);
      return status;
    }

    FAILED_IMAGE_URLS.add(normalizedUrl);
    LOADED_IMAGE_URLS.delete(normalizedUrl);
    return 'error';
  });

  IN_FLIGHT_IMAGE_REQUESTS.set(normalizedUrl, requestPromise);
  return requestPromise;
};

export const preloadImages = async (urls, options = {}) => {
  const normalizedUrls = normalizeUrls(urls);

  if (normalizedUrls.length === 0) {
    return [];
  }

  await Promise.allSettled(
    normalizedUrls.map((url) => preloadImage(url, options)),
  );

  return normalizedUrls.map((url) => ({
    url,
    status: getImagePreloadStatus(url),
  }));
};

const getBatchSnapshot = (urls) => {
  const normalizedUrls = normalizeUrls(urls);
  const statusMap = normalizedUrls.reduce((acc, url) => {
    acc[url] = getImagePreloadStatus(url);
    return acc;
  }, {});

  const pendingCount = normalizedUrls.filter(
    (url) => statusMap[url] === 'idle',
  ).length;

  return {
    urls: normalizedUrls,
    totalCount: normalizedUrls.length,
    pendingCount,
    settledCount: normalizedUrls.length - pendingCount,
    allSettled: pendingCount === 0,
    statusMap,
  };
};

export const useCachedImageStatus = (url, options = {}) => {
  const normalizedUrl = String(url || '').trim();
  const timeoutMs = Number(options?.timeoutMs) || DEFAULT_IMAGE_TIMEOUT_MS;
  const [status, setStatus] = useState(() => getImagePreloadStatus(normalizedUrl));

  useEffect(() => {
    const nextStatus = getImagePreloadStatus(normalizedUrl);
    setStatus((currentStatus) =>
      currentStatus === nextStatus ? currentStatus : nextStatus,
    );

    if (!normalizedUrl || nextStatus !== 'idle') {
      return undefined;
    }

    let active = true;
    preloadImage(normalizedUrl, { timeoutMs }).then((resolvedStatus) => {
      if (active) {
        setStatus((currentStatus) =>
          currentStatus === resolvedStatus ? currentStatus : resolvedStatus,
        );
      }
    });

    return () => {
      active = false;
    };
  }, [normalizedUrl, timeoutMs]);

  return {
    status,
    isLoaded: status === 'loaded',
    isPending: status === 'idle',
    hasError: status === 'error',
  };
};

export const useCachedImageBatch = (urls, options = {}) => {
  const timeoutMs = Number(options?.timeoutMs) || DEFAULT_IMAGE_TIMEOUT_MS;
  const urlsKey = normalizeUrls(urls).join('||');
  const normalizedUrls = useMemo(() => normalizeUrls(urls), [urlsKey]);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const nextSnapshot = getBatchSnapshot(normalizedUrls);
    if (nextSnapshot.allSettled || normalizedUrls.length === 0) {
      return undefined;
    }

    let active = true;
    preloadImages(normalizedUrls, { timeoutMs }).then(() => {
      if (active) {
        setRefreshToken((currentValue) => currentValue + 1);
      }
    });

    return () => {
      active = false;
    };
  }, [normalizedUrls, timeoutMs]);

  return useMemo(
    () => getBatchSnapshot(normalizedUrls),
    [normalizedUrls, refreshToken],
  );
};
