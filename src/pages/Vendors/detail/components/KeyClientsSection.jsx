import { useMemo, useRef } from 'react';
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

const KeyClientsSection = ({ clients }) => {
  const scrollerRef = useRef(null);
  const hasClients = Array.isArray(clients) && clients.length > 0;

  if (!hasClients) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold text-[#3D464F]">Key Clients</h2>

      <div
        ref={scrollerRef}
        className="mt-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="inline-flex min-w-full border border-[#F1F1F1] bg-white">
          {clients.map((client) => (
            <div
              key={client.id}
              className="min-w-[260px] sm:min-w-[304px] px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-center"
            >
              <a
                href={client.websiteUrl || undefined}
                target={client.websiteUrl ? '_blank' : undefined}
                rel={client.websiteUrl ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center max-w-full"
              >
                <ClientLogoBadge client={client} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyClientsSection;
