const FILTER_LABELS = ['Availability', 'Industry Type', 'Budget', 'Ratings', 'Speciality'];

const FiltersPanel = () => {
  return (
    <aside className="w-full lg:w-[308px] shrink-0">
      <div className="bg-white border border-[#E9EAEC] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-[20px] font-semibold text-[#3D464F]">Filters</h4>
          <button
            type="button"
            className="text-[14px] text-[#697077] hover:text-[#3D464F] transition-colors"
          >
            Clear filters
          </button>
        </div>

        <div className="space-y-5">
          {FILTER_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-[14px] font-semibold text-[#3D464F]">{label}</span>
              <svg className="w-[18px] h-[18px] text-[#93989E]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FiltersPanel;
