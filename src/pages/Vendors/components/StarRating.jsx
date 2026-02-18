import StarIcon from './icons/StarIcon';

const StarRating = ({
  rating = 0,
  idPrefix = 'vendor-rating',
  iconSize = 18,
  gapClassName = 'gap-[3px]',
  valueClassName = 'text-[12px] font-semibold text-[#3D464F]',
}) => {
  const safeRating = Number.isFinite(rating) ? Math.max(0, Math.min(rating, 5)) : 0;
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5 && fullStars < 5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const halfId = `${idPrefix}-half-star`;

  return (
    <div className={`flex items-center ${gapClassName}`}>
      {Array.from({ length: fullStars }).map((_, index) => (
        <StarIcon key={`full-${index}`} size={iconSize} />
      ))}

      {hasHalfStar && <StarIcon fill="half" gradientId={halfId} size={iconSize} />}

      {Array.from({ length: emptyStars }).map((_, index) => (
        <StarIcon key={`empty-${index}`} fill="#E9EAEC" size={iconSize} />
      ))}

      <span className={valueClassName}>{safeRating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
