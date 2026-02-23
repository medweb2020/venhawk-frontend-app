import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../../components/common/Checkbox';

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
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="bg-white rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-[18px] font-semibold text-[#3D464F]">Filters</h4>
            {hasFilters && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#0A2540] text-white text-[11px] font-semibold">
                {activeFilterCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasFilters}
            className={`text-[13px] transition-colors ${
              hasFilters
                ? 'text-[#697077] hover:text-[#3D464F]'
                : 'text-[#C6CBD1] cursor-not-allowed'
            }`}
          >
            Clear filters
          </button>
        </div>

        {loading && (
          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-[44px] rounded-lg bg-[#F4F5F6] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-1">
            {filterGroups.map((group, index) => {
              const isExpanded =
                typeof expandedGroups[group.key] === 'boolean'
                  ? expandedGroups[group.key]
                  : index === 0;
              const selectedCount = selectedCounts[group.key] || 0;
              const selectedOptions = filters[group.key] || [];

              return (
                <div key={group.key}>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(group.key)}
                    className="w-full flex items-center justify-between gap-3 py-[14px] text-left"
                    aria-expanded={isExpanded}
                    aria-controls={`filter-group-${group.key}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[14px] font-semibold text-[#3D464F] truncate">
                        {group.label}
                      </span>
                      {selectedCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-[#EEF3F8] text-[#0A2540] text-[10px] font-semibold px-1">
                          {selectedCount}
                        </span>
                      )}
                    </div>

                    <svg
                      className={`w-[15px] h-[15px] shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[#E8622E]' : 'text-[#93989E]'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div id={`filter-group-${group.key}`} className="pb-3">
                      <div className="space-y-[10px] max-h-[200px] overflow-y-auto pr-0.5">
                        {group.options.map((option) => {
                          const isChecked = selectedOptions.includes(option.value);
                          const optionId = `filter-${group.key}-${option.value}`;

                          return (
                            <Checkbox
                              key={option.value}
                              id={optionId}
                              checked={isChecked}
                              onChange={() => onToggleOption(group.key, option.value)}
                              label={option.label}
                            />
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
