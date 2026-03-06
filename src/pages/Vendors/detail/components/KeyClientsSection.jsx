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

  if (shouldShowImage) {
    return (
      <img
        src={client.logoSrc}
        alt={client.label}
        className={client.logoClassName || 'max-h-[34px] sm:max-h-[40px] max-w-[120px] sm:max-w-[148px] w-auto object-contain'}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  }

  if (isPending && client.logoSrc) {
    return (
      <div className="h-[34px] sm:h-[40px] w-[120px] sm:w-[148px] rounded-[8px] animate-pulse bg-[linear-gradient(135deg,#F4F6F8_0%,#E6EBF1_48%,#F8FAFC_100%)]" />
    );
  }

  return (
    <div className="h-[52px] w-[120px] sm:h-[58px] sm:w-[138px] rounded-[10px] border border-[#D8DEE5] bg-[linear-gradient(145deg,#F7FAFD_0%,#EBF1F8_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] px-2 flex items-center justify-center">
      <div className="text-center leading-[1.1]">
        <p className="text-[12px] sm:text-[13px] font-semibold text-[#40566E] tracking-[0.03em]">
          {initials}
        </p>
        <p className="mt-[2px] text-[9px] sm:text-[10px] font-medium text-[#5A6D82] truncate max-w-[110px] sm:max-w-[128px]">
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
        <div className="inline-flex min-w-full border border-[#F1F1F1] bg-[#FCFCFC]">
          {clients.map((client) => (
            <div
              key={client.id}
              className="h-[86px] sm:h-[96px] min-w-[180px] sm:min-w-[220px] px-6 sm:px-8 flex items-center justify-center"
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
