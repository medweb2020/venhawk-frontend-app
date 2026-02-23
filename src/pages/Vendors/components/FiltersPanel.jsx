import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const FiltersPanel = ({
  filterGroups,
  filters,
  activeFilterCount,
  loading,
  error,
  onToggleOption,
  onClearFilters,
}) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  const hasFilters = activeFilterCount > 0;

  const selectedCounts = useMemo(() => {
    return Object.entries(filters || {}).reduce((acc, [key, values]) => {
      acc[key] = Array.isArray(values) ? values.length : 0;
      return acc;
    }, {});
  }, [filters]);

  const toggleExpanded = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  return (
    <aside className="w-full lg:w-[324px] shrink-0">
      <div className="bg-white border border-[#E9EAEC] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h4 className="text-[20px] font-semibold text-[#3D464F]">Filters</h4>
            {hasFilters && (
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#0A2540] text-white text-[11px] font-semibold">
                {activeFilterCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasFilters}
            className={`text-[14px] transition-colors ${
              hasFilters
                ? 'text-[#697077] hover:text-[#3D464F]'
                : 'text-[#B8BDC3] cursor-not-allowed'
            }`}
          >
            Clear filters
          </button>
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-10 rounded-lg bg-[#F4F5F6] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {filterGroups.map((group, index) => {
              const isExpanded =
                typeof expandedGroups[group.key] === 'boolean'
                  ? expandedGroups[group.key]
                  : index === 0;
              const selectedCount = selectedCounts[group.key] || 0;
              const selectedOptions = filters[group.key] || [];

              return (
                <div key={group.key} className="rounded-lg border border-[#E9EAEC]">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(group.key)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                    aria-expanded={isExpanded}
                    aria-controls={`filter-group-${group.key}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[14px] font-semibold text-[#3D464F] truncate">
                        {group.label}
                      </span>
                      {selectedCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] rounded-full bg-[#EEF3F8] text-[#0A2540] text-[11px] font-semibold px-1.5">
                          {selectedCount}
                        </span>
                      )}
                    </div>

                    <svg
                      className={`w-4 h-4 text-[#93989E] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div id={`filter-group-${group.key}`} className="border-t border-[#E9EAEC] px-4 py-3">
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {group.options.map((option) => {
                          const isChecked = selectedOptions.includes(option.value);
                          const optionId = `filter-${group.key}-${option.value}`;

                          return (
                            <label
                              key={option.value}
                              htmlFor={optionId}
                              className="flex items-start gap-2 cursor-pointer text-[13px] text-[#535B64] leading-5"
                            >
                              <input
                                id={optionId}
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => onToggleOption(group.key, option.value)}
                                className="mt-0.5 h-4 w-4 rounded border-[#C6CBD1] text-[#0A2540] focus:ring-[#0A2540]"
                              />
                              <span>{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

FiltersPanel.propTypes = {
  filterGroups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  filters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  activeFilterCount: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onToggleOption: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

FiltersPanel.defaultProps = {
  loading: false,
  error: '',
};

export default FiltersPanel;
