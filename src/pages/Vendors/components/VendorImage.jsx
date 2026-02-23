import { useEffect, useMemo, useState } from 'react';

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
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = useMemo(() => getVendorInitials(name), [name]);
  const shouldShowImage = Boolean(src) && !hasError;

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
          onError={() => setHasError(true)}
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
