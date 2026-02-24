import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const VenAISearchBanner = ({
  value,
  onChange,
  onClear,
}) => {
  const inputRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hasQuery = value.trim().length > 0;
  const isInteractiveSearchOpen = isExpanded || isFocused || hasQuery;

  const focusInput = () => {
    globalThis.setTimeout(() => {
      inputRef.current?.focus();
    }, 180);
  };

  const handleOpenSearch = () => {
    setIsExpanded(true);
    focusInput();
  };

  const handleCollapseSearch = () => {
    if (hasQuery) {
      return;
    }

    setIsExpanded(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleInputBlur = () => {
    setIsFocused(false);

    globalThis.setTimeout(() => {
      if (!inputRef.current) {
        return;
      }

      if (document.activeElement === inputRef.current) {
        return;
      }

      if (!value.trim()) {
        setIsExpanded(false);
      }
    }, 120);
  };

  return (
    <section className="relative overflow-hidden rounded-[12px] mb-6">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A2540_0%,#23364B_45%,#5A4C57_65%,#0A2540_100%)]" />
      <div className="relative px-6 py-7 md:px-10 md:py-8 flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[#FCFCFC] text-[25px] md:text-[38px] leading-[1.15] font-bold tracking-[-0.3px]">
            Let Ven AI find a perfect match for you!
          </h2>

          <label htmlFor="ven-ai-vendor-search" className="sr-only">
            Search vendors with Ven AI
          </label>

          <div
            className={`relative h-[64px] w-full md:w-[430px] rounded-[18px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isInteractiveSearchOpen ? 'md:w-[560px] md:scale-[1.01]' : 'md:w-[350px]'
            }`}
          >
            <button
              type="button"
              onClick={handleOpenSearch}
              className={`absolute inset-0 rounded-[18px] bg-white text-[#0B2A47] shadow-[0_8px_24px_rgba(5,16,29,0.18)] px-6 flex items-center justify-center gap-3 transition-all duration-300 ${
                isInteractiveSearchOpen
                  ? 'opacity-0 pointer-events-none translate-y-1'
                  : 'opacity-100'
              }`}
            >
              <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-[20px] font-semibold tracking-[-0.2px]">
                Search vendors with Ven AI
              </span>
            </button>

            <div
              className={`absolute inset-0 rounded-[18px] bg-white/96 shadow-[0_10px_30px_rgba(5,16,29,0.22)] border border-white/50 px-4 flex items-center gap-3 transition-all duration-300 ${
                isInteractiveSearchOpen
                  ? 'opacity-100'
                  : 'opacity-0 pointer-events-none -translate-y-1'
              }`}
            >
              <span className="text-[#5A6470] shrink-0">
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>

              <input
                id="ven-ai-vendor-search"
                ref={inputRef}
                type="text"
                value={value}
                onFocus={() => {
                  setIsExpanded(true);
                  setIsFocused(true);
                }}
                onBlur={handleInputBlur}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search vendors with Ven AI"
                autoComplete="off"
                className="flex-1 h-full bg-transparent text-[#1E2832] text-[16px] placeholder:text-[#97A2AE] outline-none"
              />

              {hasQuery ? (
                <button
                  type="button"
                  onClick={onClear}
                  className="h-[34px] px-3 rounded-[10px] text-[12px] font-semibold text-[#344251] hover:bg-[#F4F7FA] transition-colors"
                >
                  Clear
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCollapseSearch}
                  aria-label="Collapse search"
                  title="Collapse search"
                  className="h-[34px] w-[34px] inline-flex items-center justify-center rounded-full bg-[#EEF3F8] text-[#516171] hover:bg-[#E5EDF5] hover:scale-105 transition-all duration-200"
                >
                  <svg
                    className="w-[16px] h-[16px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

VenAISearchBanner.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

VenAISearchBanner.defaultProps = {
  value: '',
};

export default VenAISearchBanner;
