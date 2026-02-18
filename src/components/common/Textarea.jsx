import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useState } from 'react';

/**
 * Textarea Component
 * @description Reusable textarea with label and error message support
 */
const Textarea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className,
  tooltip,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-normal text-gray-700 mb-2"
        >
          <span className="inline-flex items-center gap-2">
            <span>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
            {tooltip && (
              <div className="relative inline-block">
                <div
                  className="w-4 h-4 rounded-full bg-blue-100 hover:bg-blue-500 border border-blue-300 hover:border-blue-600 flex items-center justify-center cursor-help transition-all duration-200 group shadow-sm"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <span className="text-[10px] font-bold text-blue-600 group-hover:text-white transition-colors">
                    i
                  </span>
                </div>
                {showTooltip && (
                  <div className="absolute left-0 top-6 z-50 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                    {tooltip}
                  </div>
                )}
              </div>
            )}
          </span>
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        rows={rows}
        className={clsx(
          'w-full px-4 py-3 border rounded-lg transition-all duration-200',
          'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          'bg-gray-50 text-gray-900',
          'resize-y',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-200',
          className
        )}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Textarea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
  tooltip: PropTypes.string,
};

export default Textarea;
