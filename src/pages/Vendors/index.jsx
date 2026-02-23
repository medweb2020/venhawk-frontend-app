import Header from '../../components/layout/Header';
import EmptyState from './components/EmptyState';
import FiltersPanel from './components/FiltersPanel';
import VendorCard from './components/VendorCard';
import VenAISearchBanner from './components/VenAISearchBanner';
import { useVendorListing } from './hooks/useVendorListing';

const Vendors = () => {
  const {
    vendors,
    allVendors,
    loading,
    error,
    filters,
    filterGroups,
    filterOptionsLoading,
    filterOptionsError,
    activeFilterCount,
    toggleFilterOption,
    clearFilters,
    searchInput,
    searchQuery,
    hasSearchQuery,
    setSearchInput,
    clearSearch,
  } = useVendorListing();

  const totalCount = allVendors.length;
  const hasActiveConstraints = hasSearchQuery || activeFilterCount > 0;
  const resultSummary = hasSearchQuery
    ? `Showing ${vendors.length} of ${totalCount} vendor${totalCount === 1 ? '' : 's'} for "${searchQuery}".`
    : `Showing ${vendors.length} vendor${vendors.length === 1 ? '' : 's'} with ${activeFilterCount} active filter${activeFilterCount === 1 ? '' : 's'}.`;

  return (
    <div className="min-h-screen bg-[#F9F7F7]">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-[32px] font-bold text-[#3D464F] mb-6">Procurement</h1>

        <VenAISearchBanner
          value={searchInput}
          onChange={setSearchInput}
          onClear={clearSearch}
        />

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <FiltersPanel
            filterGroups={filterGroups}
            filters={filters}
            activeFilterCount={activeFilterCount}
            loading={filterOptionsLoading}
            error={filterOptionsError}
            onToggleOption={toggleFilterOption}
            onClearFilters={clearFilters}
          />

          <main className="flex-1">
            {hasActiveConstraints && (
              <div className="mb-4 rounded-lg border border-[#E9EAEC] bg-white px-3 py-2.5 text-[13px] text-[#535B64] flex flex-wrap items-center gap-2 justify-between">
                <p>{resultSummary}</p>
                <div className="flex items-center gap-2">
                  {hasSearchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="h-[28px] px-3 rounded-md border border-[#D7DDE4] text-[#46505A] hover:bg-[#F5F6F8] transition-colors"
                    >
                      Clear search
                    </button>
                  )}

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="h-[28px] px-3 rounded-md border border-[#D7DDE4] text-[#46505A] hover:bg-[#F5F6F8] transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <div className="min-h-[320px] bg-white/70 rounded-xl border border-[#E9EAEC]" />
            ) : vendors.length === 0 ? (
              <EmptyState
                title={hasSearchQuery ? 'No matching vendors found' : 'No vendors found'}
                description={
                  hasSearchQuery
                    ? `No vendors matched "${searchQuery}". Try broader terms or clear active filters.`
                    : 'Try adjusting your search query.'
                }
                actionLabel={hasSearchQuery ? 'Clear search' : activeFilterCount > 0 ? 'Clear filters' : ''}
                onAction={hasSearchQuery ? clearSearch : activeFilterCount > 0 ? clearFilters : undefined}
              />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard key={vendor.vendorId || vendor.id} vendor={vendor} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Vendors;
