import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import TierBadge from './TierBadge';
import VendorImage from './VendorImage';

const VendorCard = ({ vendor, projectId }) => {
  const vendorIdentifier = vendor.vendorId || vendor.id;
  const detailPath = projectId
    ? `/projects/${encodeURIComponent(projectId)}/vendors/${encodeURIComponent(vendorIdentifier)}`
    : `/vendors/${vendorIdentifier}`;
  const normalizedMatchingScore = Number(vendor?.matchingScore);
  const hasMatchingScore =
    vendor?.matchingScore !== null &&
    vendor?.matchingScore !== undefined &&
    Number.isFinite(normalizedMatchingScore);
  const matchingReason = String(vendor?.matchingReason || '').trim();
  const hasMatchingReason = matchingReason.length > 0;
  const matchingScoreLabel = hasMatchingScore
    ? `${Math.max(0, Math.min(100, Math.round(normalizedMatchingScore)))}% Match`
    : null;
  const reasonSourceLabel = vendor?.matchingReasonSource === 'openai'
    ? 'AI Insight'
    : 'Venhawk Insight';

  return (
    <Link to={detailPath} className="block group cursor-pointer">
      <article className="bg-[#FCFCFC] border border-[#E9EAEC] rounded-[12px] p-4 transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-[1px]">
        <div className="relative flex gap-4 items-start mb-4">
          <VendorImage
            src={vendor.logoUrl}
            alt={`${vendor.name} logo`}
            name={vendor.name}
            objectFit="contain"
            objectPosition="center"
            wrapperClassName="w-[76px] h-[76px] rounded-[14px] shrink-0 bg-white"
            imgClassName="p-[6px]"
            initialsClassName="text-[18px]"
          />

          <div className="min-w-0 flex-1 relative">
            <h3 className="text-[14px] font-semibold text-[#3D464F] truncate pr-28">{vendor.name}</h3>
            <div className="flex items-center gap-2 mt-1 mb-2 text-[12px]">
              <span className="font-medium text-[#535B64] truncate">{vendor.category}</span>
              <span className="w-[7px] h-[7px] rounded-full bg-[#D9D9D9] shrink-0" />
              <span className="font-medium text-[#3D464F] truncate">{vendor.location}</span>
            </div>
            <StarRating rating={vendor.rating} idPrefix={`vendor-${vendor.id}`} />

            <div className="absolute top-[-4px] right-[-4px] flex flex-col items-end gap-1">
              <TierBadge tier={vendor.tier} />
              {hasMatchingScore && (
                <div className="relative group/score-chip">
                  <span
                    className={`inline-flex h-[18px] items-center rounded-full px-[8px] text-[10px] font-semibold shadow-[0_0_4px_0_rgba(10,37,64,0.07)] ${
                      hasMatchingReason
                        ? 'border border-[#0A2540]/25 bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F8FF_100%)] text-[#0A2540]'
                        : 'border border-[#D8DEE5] bg-white text-[#0A2540]'
                    }`}
                  >
                    {hasMatchingReason && (
                      <svg
                        className="mr-1 h-[10px] w-[10px] text-[#0A2540]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 2a1 1 0 0 1 .95.68l1.02 3.14a1 1 0 0 0 .58.62l2.99 1.31a1 1 0 0 1 0 1.83l-2.99 1.31a1 1 0 0 0-.58.62l-1.02 3.14a1 1 0 0 1-1.9 0l-1.02-3.14a1 1 0 0 0-.58-.62L4.46 9.58a1 1 0 0 1 0-1.83l2.99-1.31a1 1 0 0 0 .58-.62l1.02-3.14A1 1 0 0 1 10 2Z" />
                      </svg>
                    )}
                    {matchingScoreLabel}
                  </span>

                  {hasMatchingReason && (
                    <div className="pointer-events-none absolute right-0 top-[calc(100%+9px)] z-30 w-[480px] max-w-[95vw] rounded-[12px] border border-[#D5E0EC] bg-[linear-gradient(180deg,#0A223A_0%,#0F2F4D_100%)] p-4 text-[11px] leading-[1.58] text-[#EAF2FA] shadow-[0_14px_34px_rgba(7,24,40,0.45)] opacity-0 translate-y-1 transition-all duration-200 group-hover/score-chip:opacity-100 group-hover/score-chip:translate-y-0">
                      <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-[#D5E0EC] bg-[#0D2A45]" />
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#BFD7EF]">
                        Venhawk Reasoning
                      </p>
                      <p className="mb-2 text-[13px] font-medium text-white whitespace-normal">
                        {matchingReason}
                      </p>
                      <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#D4E6F7]">
                        {reasonSourceLabel}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
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
