import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import TierBadge from './TierBadge';
import VendorImage from './VendorImage';

const VendorCard = ({ vendor }) => {
  const detailPath = `/vendors/${vendor.vendorId || vendor.id}`;

  return (
    <Link to={detailPath} className="block group">
      <article className="bg-[#FCFCFC] border border-[#E9EAEC] rounded-[12px] p-4 transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-[1px]">
        <div className="relative flex gap-4 items-start mb-4">
          <VendorImage
            src={vendor.logoUrl}
            alt={`${vendor.name} logo`}
            name={vendor.name}
            wrapperClassName="w-[76px] h-[76px] rounded-full shrink-0"
            initialsClassName="text-[18px]"
          />

          <div className="min-w-0 flex-1 relative">
            <h3 className="text-[14px] font-semibold text-[#3D464F] truncate pr-16">{vendor.name}</h3>
            <div className="flex items-center gap-2 mt-1 mb-2 text-[12px]">
              <span className="font-medium text-[#535B64] truncate">{vendor.category}</span>
              <span className="w-[7px] h-[7px] rounded-full bg-[#D9D9D9] shrink-0" />
              <span className="font-medium text-[#3D464F] truncate">{vendor.location}</span>
            </div>
            <StarRating rating={vendor.rating} idPrefix={`vendor-${vendor.id}`} />
            <TierBadge tier={vendor.tier} className="absolute top-[-4px] right-[-4px]" />
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
    </Link>
  );
};

export default VendorCard;
