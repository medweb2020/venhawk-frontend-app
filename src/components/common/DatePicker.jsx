import { useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * DatePicker Component
 * @description Date input field with label and error message support
 * Displays date in MM/DD/YYYY format
 */
const DatePicker = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  placeholder = 'MM/DD/YYYY',
  className,
  ...rest
}) => {
  const dateInputRef = useRef(null);

  // Convert YYYY-MM-DD to MM/DD/YYYY
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
  };

  const normalizeToISODate = (rawValue) => {
    const trimmed = String(rawValue || '').trim();
    if (!trimmed) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts.map((part) => part.trim());
      if (month && day && year?.length === 4) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    return '';
  };

  const openPicker = (event) => {
    if (disabled) {
      return;
    }

    if (event?.type === 'click') {
      event.preventDefault();
    }

    const dateInput = dateInputRef.current;
    if (!dateInput) {
      return;
    }

    if (typeof dateInput.showPicker === 'function') {
      dateInput.showPicker();
      return;
    }

    dateInput.focus();
    dateInput.click();
  };

  const handleCalendarChange = (e) => {
    const isoDate = e.target.value;

    // Create a synthetic event with formatted date
    const formattedDate = formatDisplayDate(isoDate);
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: formattedDate,
      },
    };
    onChange(syntheticEvent);
  };

  const handleDisplayChange = (e) => {
    onChange(e);
  };

  const displayValue = value || '';
  const hiddenDateValue = normalizeToISODate(displayValue);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-normal text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type="text"
          value={displayValue}
          onChange={handleDisplayChange}
          onClick={openPicker}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={clsx(
            'w-full pl-4 pr-12 py-3 border rounded-lg transition-all duration-200',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'bg-gray-50 text-gray-900',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-200',
            className
          )}
          {...rest}
        />
        {/* Calendar Icon Button */}
        <button
          type="button"
          onClick={openPicker}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
          disabled={disabled}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        {/* Hidden date input for native calendar */}
        <input
          id={`${name}-date-hidden`}
          ref={dateInputRef}
          type="date"
          value={hiddenDateValue}
          onChange={handleCalendarChange}
          className="absolute inset-0 opacity-0 pointer-events-none"
          tabIndex={-1}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default DatePicker;
