import { useRef } from 'react';

const KeyClientsSection = ({ clients }) => {
  const scrollerRef = useRef(null);

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
              className="h-[86px] sm:h-[96px] min-w-[180px] sm:min-w-[220px] px-6 sm:px-8 flex items-center justify-center border-r border-[#F1F1F1] last:border-r-0"
            >
              <span className={`uppercase text-[#8F939A] ${client.weightClass} ${client.sizeClass} leading-none tracking-tight`}>
                {client.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyClientsSection;
