import { useMemo } from 'react';
import useResponsiveCarousel from '../hooks/useResponsiveCarousel';
import { ChevronIcon } from './icons';
import { useCachedImageStatus } from '../../../../utils/imagePreload';

const buildClientInitials = (label) => {
  const words = String(label || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) {
    return 'CL';
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const ClientLogoBadge = ({ client }) => {
  const initials = useMemo(() => buildClientInitials(client.label), [client.label]);
  const { isLoaded, hasError, isPending } = useCachedImageStatus(client.logoSrc, {
    timeoutMs: 7000,
  });
  const shouldShowImage = Boolean(client.logoSrc) && isLoaded && !hasError;

  return (
    <div className="flex w-full max-w-[248px] flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-[92px] w-full items-center justify-center px-3">
        {shouldShowImage ? (
          <img
            src={client.logoSrc}
            alt={client.label}
            className={
              client.logoClassName ||
              'max-h-[64px] sm:max-h-[74px] max-w-[176px] sm:max-w-[198px] w-auto object-contain'
            }
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : isPending && client.logoSrc ? (
          <div className="h-[64px] sm:h-[74px] w-[176px] sm:w-[198px] rounded-[10px] animate-pulse border border-[#EEF2F6] bg-white" />
        ) : (
          <div className="h-[72px] w-[176px] sm:h-[80px] sm:w-[198px] rounded-[14px] border border-[#E7EDF3] bg-white px-2 flex items-center justify-center">
            <p className="text-[22px] sm:text-[24px] font-semibold text-[#31485F] tracking-[0.03em]">
              {initials}
            </p>
          </div>
        )}
      </div>

      <div className="flex min-h-[40px] sm:min-h-[52px] flex-col items-center justify-start">
        <p className="max-w-[228px] text-[14px] sm:text-[15px] font-semibold leading-[1.15] text-[#31475D]">
          {client.label}
        </p>
      </div>
    </div>
  );
};

const ClientLogoCard = ({ client }) => {
  const content = <ClientLogoBadge client={client} />;

  if (client.websiteUrl) {
    return (
      <a
        href={client.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center max-w-full"
      >
        {content}
      </a>
    );
  }

  return <div className="inline-flex items-center justify-center max-w-full">{content}</div>;
};

const ClientLogoGrid = ({ clients, columns, framed = true }) => (
  <div
    className={`grid bg-white ${framed ? 'rounded-[8px] border border-[#F1F1F1]' : ''}`}
    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
  >
    {clients.map((client) => (
      <div
        key={client.id}
        className="flex min-w-0 items-center justify-center px-6 py-5 sm:px-8 sm:py-6"
      >
        <ClientLogoCard client={client} />
      </div>
    ))}
  </div>
);

const KeyClientsSection = ({ clients }) => {
  const normalizedClients = Array.isArray(clients) ? clients : [];
  const hasClients = normalizedClients.length > 0;
  const {
    visibleCount,
    startIndex,
    canGoPrevious,
    canGoNext,
    pageCount,
    previous,
    next,
    goTo,
  } = useResponsiveCarousel({
    itemsLength: normalizedClients.length,
    desktopVisible: 4,
    mobileVisible: 1,
  });

  if (!hasClients) {
    return null;
  }

  const shouldUseCarousel = pageCount > 1;
  const carouselPages = Array.from({ length: pageCount }, (_, pageIndex) =>
    normalizedClients.slice(pageIndex, pageIndex + visibleCount)
  );

  return (
    <section className="mt-8">
      <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold text-[#3D464F]">Key Clients</h2>

      {shouldUseCarousel ? (
        <>
          <div className="group relative mt-6 overflow-hidden rounded-[10px] border border-[#F1F1F1] bg-white">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: `${pageCount * 100}%`,
                transform: `translate3d(-${startIndex * (100 / pageCount)}%,0,0)`,
              }}
            >
              {carouselPages.map((pageClients, pageIndex) => (
                <div
                  key={`key-client-page-${pageIndex}`}
                  className="shrink-0 lg:px-[76px]"
                  style={{ width: `${100 / pageCount}%` }}
                >
                  <ClientLogoGrid
                    clients={pageClients}
                    columns={pageClients.length || 1}
                    framed={false}
                  />
                </div>
              ))}
            </div>

            {canGoPrevious ? (
              <button
                type="button"
                onClick={previous}
                className="pointer-events-none invisible absolute left-4 top-1/2 hidden h-[46px] w-[46px] -translate-y-1/2 -translate-x-1.5 items-center justify-center rounded-full border border-[#EEF2F6] bg-[#FCFDFE] shadow-[0_12px_28px_rgba(34,51,68,0.12)] opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:visible focus-visible:translate-x-0 focus-visible:opacity-100 lg:flex"
                aria-label="Previous key clients"
              >
                <ChevronIcon direction="left" className="h-[22px] w-[22px]" color="#41586E" />
              </button>
            ) : null}

            {canGoNext ? (
              <button
                type="button"
                onClick={next}
                className="pointer-events-none invisible absolute right-4 top-1/2 hidden h-[46px] w-[46px] -translate-y-1/2 translate-x-1.5 items-center justify-center rounded-full border border-[#EEF2F6] bg-[#FCFDFE] shadow-[0_12px_28px_rgba(34,51,68,0.12)] opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:visible focus-visible:translate-x-0 focus-visible:opacity-100 lg:flex"
                aria-label="Next key clients"
              >
                <ChevronIcon direction="right" className="h-[22px] w-[22px]" color="#41586E" />
              </button>
            ) : null}
          </div>

          <div className="mt-6 sm:mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-[10px] rounded-full bg-white/78 px-4 py-2 shadow-[0_8px_22px_rgba(61,70,79,0.06)] ring-1 ring-[#E9EAEC] backdrop-blur-sm sm:gap-[14px]">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={`key-client-dot-${index}`}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`h-[10px] w-[10px] rounded-full transition-all duration-200 sm:h-[12px] sm:w-[12px] ${
                    startIndex === index
                      ? 'scale-110 bg-[#535B64]'
                      : 'bg-[#D8DEE5] hover:bg-[#BFC8D2]'
                  }`}
                  aria-label={`Go to key clients page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6">
          <ClientLogoGrid clients={normalizedClients} columns={normalizedClients.length} />
        </div>
      )}
    </section>
  );
};

export default KeyClientsSection;
