import { useMemo } from 'react';
import { useCachedImageStatus } from '../../../utils/imagePreload';

const getVendorInitials = (name = '') => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'VN';
  }

  const words = trimmedName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const VendorImage = ({
  src,
  alt,
  name,
  wrapperClassName = '',
  imgClassName = '',
  fallbackClassName = '',
  initialsClassName = '',
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackText,
  loading = 'lazy',
  cacheTimeoutMs = 7000,
  placeholderClassName = '',
}) => {
  const initials = useMemo(() => getVendorInitials(name), [name]);
  const { isLoaded, hasError, isPending } = useCachedImageStatus(src, {
    timeoutMs: cacheTimeoutMs,
  });
  const shouldShowImage = Boolean(src) && isLoaded && !hasError;

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt || `${name || 'Vendor'} image`}
          className={`w-full h-full ${imgClassName}`}
          style={{ objectFit, objectPosition }}
          referrerPolicy="no-referrer"
          loading={loading}
          decoding="async"
        />
      ) : isPending && src ? (
        <div
          className={`w-full h-full animate-pulse bg-[linear-gradient(135deg,#F4F6F8_0%,#E6EBF1_48%,#F8FAFC_100%)] ${placeholderClassName}`}
          aria-hidden="true"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center bg-[linear-gradient(150deg,#0A2540_0%,#3B5166_55%,#FFA077_100%)] ${fallbackClassName}`}
          aria-hidden="true"
        >
          <span className={`font-bold text-white ${initialsClassName}`}>{fallbackText || initials}</span>
        </div>
      )}
    </div>
  );
};

export default VendorImage;
