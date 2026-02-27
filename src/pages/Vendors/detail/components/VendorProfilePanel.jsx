import StarRating from '../../components/StarRating';
import TierBadge from '../../components/TierBadge';
import VendorImage from '../../components/VendorImage';

const formatWebsite = (websiteUrl, logoUrl) => {
  if (websiteUrl) {
    const withProtocol = /^https?:\/\//i.test(websiteUrl)
      ? websiteUrl
      : `https://${websiteUrl}`;

    try {
      const parsedUrl = new URL(withProtocol);
      const host = parsedUrl.hostname.replace(/^www\./i, '');
      const path = parsedUrl.pathname && parsedUrl.pathname !== '/'
        ? parsedUrl.pathname.replace(/\/$/, '')
        : '';
      return `${host}${path}`;
    } catch {
      return websiteUrl
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .replace(/\/$/, '');
    }
  }

  if (logoUrl && logoUrl.includes('logo.clearbit.com/')) {
    return logoUrl.replace('https://logo.clearbit.com/', '');
  }

  return 'www.ey.com';
};

const VendorProfilePanel = ({ vendor }) => {
  const website = formatWebsite(vendor.websiteUrl, vendor.logoUrl);
  const websiteHref = /^https?:\/\//i.test(vendor.websiteUrl || '')
    ? vendor.websiteUrl
    : `https://${website}`;
  const headquarter = vendor.headquarter || vendor.location || 'United States';
  const budgetLabel = vendor.startFrom?.toLowerCase().includes('contact')
    ? vendor.startFrom
    : `${vendor.startFrom || '$50k'} Starting`;
  const specialtyText = vendor.specialtyFull || vendor.specialty || 'Finance';

  return (
    <section className="w-full xl:max-w-[560px] min-h-[430px] flex flex-col justify-between">
      <div>
        <div className="relative flex items-start gap-3 sm:gap-4">
          <VendorImage
            src={vendor.logoUrl}
            alt={`${vendor.name} logo`}
            name={vendor.name}
            objectFit="contain"
            objectPosition="center"
            wrapperClassName="w-[62px] h-[62px] sm:w-[70px] sm:h-[70px] rounded-[12px] shrink-0 bg-white"
            imgClassName="p-[6px]"
            initialsClassName="text-[20px] sm:text-[24px]"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <h1 className="text-[24px] sm:text-[30px] lg:text-[40px] leading-[1.1] font-bold text-[#3D464F] break-words min-w-0">
                {vendor.name}
              </h1>
              <TierBadge tier={vendor.tier} className="shrink-0 mt-[2px]" />
            </div>
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
          </div>
        </div>

        <p className="mt-5 sm:mt-7 text-[14px] sm:text-[15px] leading-[1.35] text-[#3D464F]">
          {vendor.description ||
            'At EY, our purpose is Building a better working world. The insights and quality services we provide help build trust and confidence in the capital markets and in economies the world over.'}
        </p>

        <div className="mt-5 sm:mt-7 space-y-2 text-[14px] sm:text-[15px] font-semibold text-[#697077]">
          <p>
            <span className="text-[#535B64]">Speciality :</span>
            <span className="ml-3">{specialtyText}</span>
          </p>
          <p>
            <span className="text-[#535B64]">Budget :</span>
            <span className="ml-[34px]">{budgetLabel}</span>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 text-[#535B64]">
        <div className="min-w-0 sm:pr-4 sm:border-r sm:border-[#BEC1C5] pb-3 sm:pb-0 border-b sm:border-b-0 border-[#E9EAEC]">
          <p className="text-[15px] font-semibold">Website</p>
          <a
            href={websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-[15px] text-[#697077] break-all leading-[1.25] hover:underline"
            title={website}
          >
            {website}
          </a>
        </div>

        <div className="min-w-0 sm:px-4 sm:border-r sm:border-[#BEC1C5] pb-3 sm:pb-0 border-b sm:border-b-0 border-[#E9EAEC]">
          <p className="text-[15px] font-semibold">Headquarter</p>
          <p className="mt-2 text-[15px] break-words leading-[1.25]">{headquarter}</p>
        </div>

        <div className="min-w-0 sm:pl-4">
          <p className="text-[15px] font-semibold">Share Via</p>
          <a
            href={websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-[15px] text-[#697077] break-all leading-[1.25] hover:underline"
            title={website}
          >
            {website}
          </a>
        </div>
      </div>
    </section>
  );
};

export default VendorProfilePanel;
