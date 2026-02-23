import Header from '../../components/layout/Header';
import EmptyState from './components/EmptyState';
import FiltersPanel from './components/FiltersPanel';
import VendorCard from './components/VendorCard';
import VenAISearchBanner from './components/VenAISearchBanner';
import { useVendorListing } from './hooks/useVendorListing';

const Vendors = () => {
  const {
    vendors,
    loading,
    error,
    filters,
    filterGroups,
    filterOptionsLoading,
    filterOptionsError,
    activeFilterCount,
    toggleFilterOption,
    clearFilters,
  } = useVendorListing();

  return (
    <div className="min-h-screen bg-[#F9F7F7]">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-[32px] font-bold text-[#3D464F] mb-6">Procurement</h1>

        <VenAISearchBanner />

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
            {activeFilterCount > 0 && (
              <div className="mb-4 px-3 py-2 rounded-lg border border-[#E9EAEC] bg-white text-[13px] text-[#535B64]">
                Showing results for {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}.
              </div>
            )}

            {loading ? (
              <div className="min-h-[320px] bg-white/70 rounded-xl border border-[#E9EAEC]" />
            ) : vendors.length === 0 ? (
              <EmptyState />
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
