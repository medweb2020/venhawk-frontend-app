import TierIcon from './icons/TierIcon';

const TierBadge = ({ tier, className = '' }) => {
  if (!tier) {
    return null;
  }

  const tierLabel = String(tier).trim();

  return (
    <div className={`max-w-full rounded-[36px] border border-[#E9EAEC] bg-white shadow-[0_0_5px_0_rgba(10,37,64,0.09)] px-[8px] py-[5px] ${className}`}>
      <div className="flex items-center justify-center gap-[4px] min-w-0">
        <TierIcon />
        <span
          className="min-w-0 max-w-[95px] sm:max-w-[120px] truncate text-[9px] font-bold bg-[linear-gradient(208deg,#0A2540_10%,#3B5166_35%,#FFA077_88%)] bg-clip-text text-transparent whitespace-nowrap"
          title={tierLabel}
        >
          {tierLabel}
        </span>
      </div>
    </div>
  );
};

export default TierBadge;
