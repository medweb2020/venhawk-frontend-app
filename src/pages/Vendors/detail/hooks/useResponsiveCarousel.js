import { useCallback, useEffect, useMemo, useState } from 'react';

const resolveVisibleCount = (breakpoint, desktopVisible, mobileVisible) => {
  if (typeof window === 'undefined') {
    return desktopVisible;
  }

  return window.innerWidth >= breakpoint ? desktopVisible : mobileVisible;
};

export const useResponsiveCarousel = ({
  itemsLength,
  desktopVisible = 3,
  mobileVisible = 1,
  breakpoint = 1024,
  initialStart = 0,
}) => {
  const [visibleCount, setVisibleCount] = useState(() =>
    resolveVisibleCount(breakpoint, desktopVisible, mobileVisible)
  );

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(resolveVisibleCount(breakpoint, desktopVisible, mobileVisible));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint, desktopVisible, mobileVisible]);

  const maxStartIndex = useMemo(
    () => Math.max(itemsLength - visibleCount, 0),
    [itemsLength, visibleCount]
  );

  const [startIndex, setStartIndex] = useState(() =>
    Math.min(Math.max(initialStart, 0), maxStartIndex)
  );

  useEffect(() => {
    setStartIndex((prev) => Math.min(prev, maxStartIndex));
  }, [maxStartIndex]);

  const previous = useCallback(() => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const next = useCallback(() => {
    setStartIndex((prev) => Math.min(prev + 1, maxStartIndex));
  }, [maxStartIndex]);

  const goTo = useCallback(
    (index) => {
      setStartIndex(Math.max(0, Math.min(index, maxStartIndex)));
    },
    [maxStartIndex]
  );

  const pageCount = maxStartIndex + 1;

  return {
    visibleCount,
    startIndex,
    maxStartIndex,
    canGoPrevious: startIndex > 0,
    canGoNext: startIndex < maxStartIndex,
    pageCount,
    previous,
    next,
    goTo,
  };
};

export default useResponsiveCarousel;
