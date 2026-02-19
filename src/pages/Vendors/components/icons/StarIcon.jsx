const STAR_PATH =
  'M9 1.5L10.9779 5.48884L15.375 6.13075L12.1875 9.23875L12.94 13.625L9 11.5538L5.06 13.625L5.8125 9.23875L2.625 6.13075L7.02213 5.48884L9 1.5Z';

const StarIcon = ({ fill = '#FFB400', gradientId = '', size = 18 }) => {
  const isHalf = fill === 'half';

  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      {isHalf && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="18" y2="0">
            <stop offset="50%" stopColor="#FFB400" />
            <stop offset="50%" stopColor="#E9EAEC" />
          </linearGradient>
        </defs>
      )}
      <path d={STAR_PATH} fill={isHalf ? `url(#${gradientId})` : fill} />
    </svg>
  );
};

export default StarIcon;
