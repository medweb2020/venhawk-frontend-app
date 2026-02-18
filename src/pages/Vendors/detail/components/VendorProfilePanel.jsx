import StarRating from '../../components/StarRating';
import TierBadge from '../../components/TierBadge';

const formatWebsite = (websiteUrl, logoUrl) => {
  if (websiteUrl) {
    return websiteUrl
      .replace(/^https?:\/\//i, '')
      .replace(/\/$/, '');
  }

  if (logoUrl && logoUrl.includes('logo.clearbit.com/')) {
    return logoUrl.replace('https://logo.clearbit.com/', '');
  }

  return 'www.ey.com';
};

const VendorProfilePanel = ({ vendor }) => {
  const website = formatWebsite(vendor.websiteUrl, vendor.logoUrl);
  const headquarter = vendor.headquarter || vendor.location || 'United States';
  const budgetLabel = vendor.startFrom?.toLowerCase().includes('contact')
    ? vendor.startFrom
    : `${vendor.startFrom || '$50k'} Starting`;

  return (
    <section className="w-full xl:max-w-[560px] min-h-[430px] flex flex-col justify-between">
      <div>
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="w-[62px] h-[62px] sm:w-[70px] sm:h-[70px] rounded-full overflow-hidden bg-[#F1F3F5] shrink-0 flex items-center justify-center">
            {vendor.logoUrl ? (
              <img
                src={vendor.logoUrl}
                alt={`${vendor.name} logo`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-[20px] sm:text-[24px] font-bold text-[#3D464F]">
                {vendor.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="relative flex-1 pr-[60px] sm:pr-[70px]">
            <h1 className="text-[24px] sm:text-[30px] lg:text-[40px] leading-[1.1] font-bold text-[#3D464F] break-words">
              {vendor.name}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-[12px] sm:text-[13px]">
              <span className="font-semibold text-[#535B64] truncate">{vendor.category}</span>
              <span className="w-[7px] h-[7px] rounded-full bg-[#D9D9D9] shrink-0" />
              <span className="font-semibold text-[#3D464F] truncate">{vendor.location}</span>
            </div>
            <div className="mt-2">
              <StarRating
                rating={vendor.rating}
                idPrefix={`vendor-detail-${vendor.id}`}
                iconSize={16}
                valueClassName="text-[18px] sm:text-[20px] leading-none font-semibold text-[#3D464F]"
              />
            </div>

            <TierBadge tier={vendor.tier} className="absolute top-0 right-0 scale-90 sm:scale-100 origin-top-right" />
          </div>
        </div>

        <p className="mt-5 sm:mt-7 text-[14px] sm:text-[15px] leading-[1.35] text-[#3D464F]">
          {vendor.description ||
            'At EY, our purpose is Building a better working world. The insights and quality services we provide help build trust and confidence in the capital markets and in economies the world over.'}
        </p>

        <div className="mt-5 sm:mt-7 space-y-2 text-[14px] sm:text-[15px] font-semibold text-[#697077]">
          <p>
            <span className="text-[#535B64]">Speciality :</span>
            <span className="ml-3">{vendor.specialty || 'Finance'}</span>
          </p>
          <p>
            <span className="text-[#535B64]">Budget :</span>
            <span className="ml-[34px]">{budgetLabel}</span>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 text-[#535B64]">
        <div className="sm:pr-4 sm:border-r sm:border-[#BEC1C5] pb-3 sm:pb-0 border-b sm:border-b-0 border-[#E9EAEC]">
          <p className="text-[15px] font-semibold">Website</p>
          <p className="mt-2 text-[15px]">{website}</p>
        </div>

        <div className="sm:px-4 sm:border-r sm:border-[#BEC1C5] pb-3 sm:pb-0 border-b sm:border-b-0 border-[#E9EAEC]">
          <p className="text-[15px] font-semibold">Headquarter</p>
          <p className="mt-2 text-[15px]">{headquarter}</p>
        </div>

        <div className="sm:pl-4">
          <p className="text-[15px] font-semibold">Share Via</p>
          <p className="mt-2 text-[15px]">{website}</p>
        </div>
      </div>
    </section>
  );
};

export default VendorProfilePanel;
