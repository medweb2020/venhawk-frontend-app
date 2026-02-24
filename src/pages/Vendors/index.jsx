import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import Header from '../../components/layout/Header';
import EmptyState from './components/EmptyState';
import FiltersPanel from './components/FiltersPanel';
import VendorCard from './components/VendorCard';
import VenAISearchBanner from './components/VenAISearchBanner';
import { useVendorListing } from './hooks/useVendorListing';

const Vendors = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projectData } = useProject();

  const requestedProjectId =
    searchParams.get('projectId') || projectData?.latestProjectId || null;

  const {
    vendors,
    loading,
    error,
    projectId,
    filters,
    filterGroups,
    filterOptionsLoading,
    filterOptionsError,
    activeFilterCount,
    toggleFilterOption,
    clearFilters,
    expandedFilterGroupKey,
    setExpandedGroup,
  } = useVendorListing({ projectId: requestedProjectId });

  const hasProjectContext = Boolean(projectId);

  return (
    <div className="min-h-screen bg-[#F9F7F7]">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-[32px] font-bold text-[#3D464F] mb-6">
          Project Recommendations
        </h1>

        <VenAISearchBanner />

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!hasProjectContext ? (
          <EmptyState
            title="No project selected"
            description="Create a project and click Find Vendors to view matched recommendations."
            actionLabel="Create project"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <FiltersPanel
              filterGroups={filterGroups}
              filters={filters}
              activeFilterCount={activeFilterCount}
              loading={filterOptionsLoading}
              error={filterOptionsError}
              onToggleOption={toggleFilterOption}
              onClearFilters={clearFilters}
              expandedGroupKey={expandedFilterGroupKey}
              onToggleExpandedGroup={setExpandedGroup}
            />

            <main className="flex-1">
              {loading ? (
                <div className="min-h-[320px] bg-white/70 rounded-xl border border-[#E9EAEC]" />
              ) : vendors.length === 0 ? (
                <EmptyState
                  title="No vendors found"
                  description="No recommended vendors were generated for this project."
                  actionLabel={
                    activeFilterCount > 0 ? 'Clear filters' : ''
                  }
                  onAction={
                    activeFilterCount > 0 ? clearFilters : undefined
                  }
                />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {vendors.map((vendor) => (
                    <VendorCard
                      key={vendor.vendorId || vendor.id}
                      vendor={vendor}
                      projectId={projectId}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
