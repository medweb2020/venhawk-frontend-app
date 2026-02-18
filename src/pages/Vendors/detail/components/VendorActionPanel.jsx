import { CalendarIcon, PlayCircleIcon } from './icons';
import { VENDOR_PAGE_COPY } from '../data/staticContent';

const VendorActionPanel = ({ vendor }) => {
  return (
    <section className="w-full xl:max-w-[590px] rounded-[12px] border border-[#E9EAEC] bg-[#FCFCFC] p-[5px] sm:p-[6px]">
      <div className="relative overflow-hidden rounded-[8px] px-3 sm:px-[18px] py-[10px] sm:py-[12px] bg-[linear-gradient(96deg,#0A2540_10%,#2A3E57_46%,#684E58_72%,#0A2540_94%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_40%,rgba(255,160,119,0.38),transparent_46%)]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 text-[#F9F7F7]">
            <span className="inline-flex h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] items-center justify-center rounded-full bg-[rgba(59,81,102,0.34)] backdrop-blur-[2px]">
              <PlayCircleIcon className="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]" />
            </span>
            <p className="text-[13px] sm:text-[14px] leading-[1.25] sm:max-w-[240px]">{VENDOR_PAGE_COPY.demoPrompt}</p>
          </div>

          <button
            type="button"
            className="h-[46px] sm:h-[50px] shrink-0 rounded-[12px] border border-[#FCFCFC] px-5 sm:px-6 text-[13px] sm:text-[14px] font-semibold text-[#FCFCFC] w-full sm:w-auto"
          >
            Request a demo
          </button>
        </div>
      </div>

      <div className="mt-[6px] h-[220px] sm:h-[286px] rounded-[4px] overflow-hidden bg-[linear-gradient(125deg,#84AFE8_0%,#BCD4F6_52%,#EDF5FF_100%)] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(10,37,64,0.15),transparent_44%)]" />
        {vendor.logoUrl ? (
          <img
            src={vendor.logoUrl}
            alt={`${vendor.name} showcase`}
            className="relative z-10 w-full h-full object-contain p-6 sm:p-9"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="relative z-10 h-full flex items-center justify-center text-[72px] font-bold text-[#0A2540]">
            {vendor.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="mt-[6px] grid grid-cols-2 gap-[6px]">
        <button
          type="button"
          className="h-[50px] sm:h-[56px] rounded-[10px] border border-[#BEC1C5] bg-[#FCFCFC] text-[13px] sm:text-[14px] font-semibold text-[#0A2540]"
        >
          Message
        </button>
        <button
          type="button"
          className="h-[50px] sm:h-[56px] rounded-[10px] border border-[#0A2540] bg-[#0A2540] text-[13px] sm:text-[14px] font-semibold text-[#FCFCFC] flex items-center justify-center gap-2"
        >
          <CalendarIcon className="w-[18px] h-[18px]" />
          Schedule a Zoom call
        </button>
      </div>
    </section>
  );
};

export default VendorActionPanel;
