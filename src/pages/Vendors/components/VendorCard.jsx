import StarIcon from './icons/StarIcon';
import TierIcon from './icons/TierIcon';

const StarRating = ({ rating = 0, idPrefix }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);
  const halfId = `${idPrefix}-half-star`;

  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: fullStars }).map((_, index) => (
        <StarIcon key={`full-${index}`} />
      ))}

      {hasHalfStar && (
        <StarIcon fill="half" gradientId={halfId} />
      )}

      {Array.from({ length: emptyStars }).map((_, index) => (
        <StarIcon key={`empty-${index}`} fill="#E9EAEC" />
      ))}

      <span className="text-[12px] font-semibold text-[#3D464F]">{rating.toFixed(1)}</span>
    </div>
  );
};

const TierBadge = ({ tier }) => {
  if (!tier) {
    return null;
  }

  return (
    <div className="absolute top-[-4px] right-[-4px] rounded-[36px] border border-[#E9EAEC] bg-white shadow-[0_0_5px_0_rgba(10,37,64,0.09)] px-[8px] py-[5px]">
      <div className="flex items-center justify-center gap-[4px]">
        <TierIcon />
        <span className="text-[9px] font-bold bg-[linear-gradient(208deg,#0A2540_10%,#3B5166_35%,#FFA077_88%)] bg-clip-text text-transparent whitespace-nowrap">
          {tier}
        </span>
      </div>
    </div>
  );
};

const VendorCard = ({ vendor }) => {
  return (
    <article className="bg-[#FCFCFC] border border-[#E9EAEC] rounded-[12px] p-4 hover:shadow-md transition-shadow">
      <div className="relative flex gap-4 items-start mb-4">
        <div className="w-[76px] h-[76px] rounded-full overflow-hidden bg-transparent flex items-center justify-center shrink-0">
          {vendor.logoUrl ? (
            <img
              src={vendor.logoUrl}
              alt={`${vendor.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[18px] font-bold text-[#3D464F]">
              {vendor.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 relative">
          <h3 className="text-[14px] font-semibold text-[#3D464F] truncate pr-16">{vendor.name}</h3>
          <div className="flex items-center gap-2 mt-1 mb-2 text-[12px]">
            <span className="font-medium text-[#535B64] truncate">{vendor.category}</span>
            <span className="w-[7px] h-[7px] rounded-full bg-[#D9D9D9] shrink-0" />
            <span className="font-medium text-[#3D464F] truncate">{vendor.location}</span>
          </div>
          <StarRating rating={vendor.rating} idPrefix={`vendor-${vendor.id}`} />
          <TierBadge tier={vendor.tier} />
        </div>
      </div>

      <p className="text-[12px] text-[#697077] leading-[1.35] h-[34px] overflow-hidden mb-4">
        {vendor.description}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-[#E9EAEC] rounded-[5px] bg-[#FCFCFC] py-2 px-4 text-center">
          <p className="text-[8px] font-semibold text-[#697077] mb-1">Speciality</p>
          <p className="text-[10px] font-bold bg-[linear-gradient(197deg,#0A2540_10%,#3B5166_35%,#FFA077_88%)] bg-clip-text text-transparent truncate">
            {vendor.specialty}
          </p>
        </div>

        <div className="border border-[#E9EAEC] rounded-[5px] bg-[#FCFCFC] py-2 px-4 text-center">
          <p className="text-[8px] font-semibold text-[#697077] mb-1">Start From</p>
          <p className="text-[10px] font-bold bg-[linear-gradient(206deg,#0A2540_10%,#3B5166_35%,#FFA077_88%)] bg-clip-text text-transparent truncate">
            {vendor.startFrom}
          </p>
        </div>
      </div>
    </article>
  );
};

export default VendorCard;
