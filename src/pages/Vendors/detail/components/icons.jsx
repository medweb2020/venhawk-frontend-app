export const ArrowLeftIcon = ({ className = 'w-6 h-6', color = '#1D1B20' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M19 11H7.83l4.88-4.88a1 1 0 0 0-1.42-1.42l-6.59 6.59a1 1 0 0 0 0 1.42l6.59 6.59a1 1 0 1 0 1.42-1.42L7.83 13H19a1 1 0 1 0 0-2Z"
      fill={color}
    />
  </svg>
);

export const PlayCircleIcon = ({ className = 'w-6 h-6', color = '#FCFCFC' }) => (
  <svg className={className} viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <circle cx="17" cy="17" r="15.5" stroke={color} strokeWidth="2" />
    <path d="M14 11.8L23 17L14 22.2V11.8Z" fill={color} />
  </svg>
);

export const CalendarIcon = ({ className = 'w-5 h-5', color = '#FCFCFC' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M3 9H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 3V7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 3V7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const ChevronIcon = ({
  direction = 'right',
  className = 'w-6 h-6',
  color = '#535B64',
}) => {
  const rotation = direction === 'left' ? 'rotate-180' : '';

  return (
    <svg className={`${className} ${rotation}`} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path
        d="M13.5 9L22.5 18L13.5 27"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  );
};
