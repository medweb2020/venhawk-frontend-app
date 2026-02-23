import { useId } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Checkbox = ({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  inputClassName = '',
  boxClassName = '',
  labelClassName = '',
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        'flex items-center gap-2.5',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer group',
        className,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          'peer sr-only',
          'focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
          inputClassName,
        )}
        {...rest}
      />

      <span
        aria-hidden="true"
        className={clsx(
          'relative inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border border-[#8A8F95] bg-white transition-all',
          'peer-checked:border-[#1F6FEB] peer-checked:bg-[#1F6FEB]',
          '[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100',
          'peer-disabled:border-[#C6CBD1] peer-disabled:bg-[#F4F5F6]',
          'peer-focus:outline-none peer-focus:ring-0',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-[#1F6FEB]/25',
          boxClassName,
        )}
      >
        <svg
          viewBox="0 0 16 16"
          className="h-[10px] w-[10px] text-white transition-opacity"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 8.2 6.4 11l6.1-6.1" />
        </svg>
      </span>

      {label && (
        <span
          className={clsx(
            'text-[13px] text-[#535B64] leading-[1.4] transition-colors',
            !disabled && 'group-hover:text-[#3D464F]',
            labelClassName,
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  boxClassName: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default Checkbox;
