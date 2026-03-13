import { useEffect, useRef, useState } from 'react';
import { formatCategorySummary, getInitials } from '../utils/adminWorkspace';

export const EmptyState = ({ title, description }) => (
  <div className="rounded-[22px] border border-dashed border-[#D7DEE6] bg-white p-8 text-center">
    <h3 className="text-[22px] font-bold text-[#26313C]">{title}</h3>
    <p className="mt-2 text-[14px] text-[#667382]">{description}</p>
  </div>
);

export const SectionCard = ({ title, description, aside = null, children }) => (
  <section className="rounded-[24px] border border-[#E6EAEE] bg-white p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2 className="text-[28px] font-bold text-[#26313C]">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-[780px] text-[14px] leading-7 text-[#667382]">
            {description}
          </p>
        ) : null}
      </div>
      {aside}
    </div>
    <div className="mt-6">{children}</div>
  </section>
);

export const FieldShell = ({ label, required = false, error = '', children }) => (
  <label className="block">
    <span className="mb-2 block text-[13px] font-semibold text-[#485664]">
      {label}
      {required ? <span className="ml-1 text-[#B25050]">*</span> : null}
    </span>
    {children}
    {error ? (
      <span className="mt-2 block text-[12px] font-medium text-[#B25050]">{error}</span>
    ) : null}
  </label>
);

export const inputClassName = (hasError = false) =>
  `w-full rounded-[16px] border bg-white px-4 py-3 text-[15px] text-[#27313C] outline-none transition-colors placeholder:text-[#96A2AF] ${
    hasError
      ? 'border-[#E7B7B7] focus:border-[#D78E8E]'
      : 'border-[#DCE3EA] focus:border-[#B7C8D9]'
  }`;

export const ActionButton = ({
  children,
  tone = 'primary',
  type = 'button',
  disabled = false,
  onClick,
}) => {
  const className = {
    primary: 'border-[#0E2B4C] bg-[#0E2B4C] text-white hover:bg-[#12345D]',
    secondary: 'border-[#D7DEE6] bg-white text-[#2B3641] hover:bg-[#F6F8FA]',
    danger: 'border-[#F0CCCC] bg-white text-[#A23A3A] hover:bg-[#FFF5F5]',
  }[tone];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
};

export const UploadButton = ({ inputId, hasLogo, busy, onSelect, tone = 'primary' }) => {
  const className = {
    primary: 'border-[#0E2B4C] bg-[#0E2B4C] text-white hover:bg-[#12345D]',
    secondary: 'border-[#D7DEE6] bg-white text-[#2B3641] hover:bg-[#F6F8FA]',
  }[tone];

  return (
    <label htmlFor={inputId} className="cursor-pointer">
      <span
        className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${className} ${
          busy ? 'cursor-not-allowed opacity-60' : ''
        }`}
      >
        {hasLogo ? 'Replace logo' : 'Add logo'}
      </span>
      <input
        id={inputId}
        type="file"
        accept="image/*,.svg,.ico"
        className="hidden"
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onSelect(file);
          }
          event.target.value = '';
        }}
      />
    </label>
  );
};

export const AssetPreview = ({ src, alt, initials, size = 'medium' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizeClassName = {
    small: 'h-14 w-14 rounded-[16px] p-2.5',
    medium: 'h-24 w-24 rounded-[20px] p-4',
    large: 'h-28 w-28 rounded-[22px] p-4',
  }[size];

  if (src && !hasError) {
    return (
      <div className={`flex items-center justify-center border border-[#E6EAEE] bg-white ${sizeClassName}`}>
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center border border-dashed border-[#D5DCE3] bg-white ${sizeClassName}`}>
      <span className="text-[18px] font-bold tracking-[0.08em] text-[#5B6A79]">{initials}</span>
    </div>
  );
};

export const StatusBadge = ({ value }) => (
  <span className="inline-flex items-center rounded-full border border-[#D7DEE6] bg-[#F8FAFC] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#556372]">
    {value}
  </span>
);

export const CategorySelector = ({ options, selectedValues, onToggle, error = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  return (
    <FieldShell label="Project Categories" required error={error}>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          className={inputClassName(Boolean(error))}
        >
          <span className="block truncate text-left">
            {formatCategorySummary(options, selectedValues)}
          </span>
        </button>

        {isOpen ? (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 max-h-80 overflow-y-auto rounded-[18px] border border-[#DCE3EA] bg-white p-3 shadow-[0_18px_60px_rgba(17,24,39,0.08)]">
            <div className="space-y-2">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.id);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onToggle(option.id)}
                    className={`flex w-full items-start justify-between rounded-[14px] border px-3 py-3 text-left transition-colors ${
                      isSelected
                        ? 'border-[#0E2B4C] bg-[#F2F7FC]'
                        : 'border-[#E6EAEE] bg-white hover:bg-[#FAFBFC]'
                    }`}
                  >
                    <div className="pr-3">
                      <p className="text-[14px] font-semibold text-[#27313C]">
                        {option.label}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[#7A8794]">
                        {option.value}
                      </p>
                    </div>
                    <span
                      className={`mt-1 h-5 w-5 rounded-full border ${
                        isSelected ? 'border-[#0E2B4C] bg-[#0E2B4C]' : 'border-[#C8D2DC] bg-white'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
};

export const OptionalCategorySelect = ({ value, options, onChange }) => (
  <select
    value={value ?? ''}
    onChange={(event) => onChange(event.target.value)}
    className={inputClassName(false)}
  >
    <option value="">All categories</option>
    {options.map((option) => (
      <option key={option.id} value={option.id}>
        {option.label}
      </option>
    ))}
  </select>
);

export const ToggleCard = ({ label, value, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-[18px] border px-4 py-4 text-left transition-colors ${
      value ? 'border-[#0E2B4C] bg-[#F2F7FC]' : 'border-[#DCE3EA] bg-white hover:bg-[#FAFBFC]'
    }`}
  >
    <p className="text-[15px] font-semibold text-[#26313C]">{label}</p>
    <p className="mt-1 text-[13px] text-[#667382]">{value ? 'Enabled' : 'Disabled'}</p>
  </button>
);

export const AdminLink = ({ href, children }) => {
  if (!href) {
    return <span className="text-[13px] text-[#8A96A3]">-</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[13px] font-medium text-[#285A8B] underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
};

export const ModalShell = ({ isOpen, onClose, title, description, children }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,23,42,0.45)] px-4 py-6">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-[101] max-h-[90vh] w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-[#DCE3EA] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#EEF2F5] px-6 py-5">
          <div>
            <h2 className="text-[28px] font-bold text-[#26313C]">{title}</h2>
            {description ? (
              <p className="mt-2 text-[14px] text-[#667382]">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#D7DEE6] px-3 py-2 text-[13px] font-semibold text-[#5B6978] transition-colors hover:bg-[#F6F8FA]"
          >
            Close
          </button>
        </div>
        <div className="max-h-[calc(90vh-98px)] overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
};

export { getInitials };
