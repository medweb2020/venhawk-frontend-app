import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import Header from '../../components/layout/Header';
import VendorCard from './components/VendorCard';
import VenAISearchBanner from './components/VenAISearchBanner';
import EmptyState from './components/EmptyState';

/**
 * Vendors Page Component
 * @description Displays matched vendors with filters
 */
const Vendors = () => {
  const navigate = useNavigate();
  const { projectData } = useProject();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Load vendors from context
  useEffect(() => {
    // If matchedVendors is undefined, user accessed /vendors directly without submission
    // In this case, redirect to landing page
    if (projectData.matchedVendors === undefined) {
      navigate('/');
      return;
    }

    // If matchedVendors is an empty array, show empty state (don't redirect)
    // If matchedVendors has items, show them
    const loadVendors = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      // TODO: REMOVE THIS LINE AFTER TESTING - Forces empty state for testing
      // setVendors([]);
      setVendors(projectData.matchedVendors || []);
      setLoading(false);
    };

    loadVendors();
  }, [projectData.matchedVendors, navigate]);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Title and Mobile Filter Button */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Procurement</h1>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* VenAI Search Banner */}
        <VenAISearchBanner />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters - Hidden on mobile, visible on desktop */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0`}>
            <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                <h3 className="text-base font-semibold text-gray-900">Filters</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Clear filters
                </button>
              </div>

              <div>
                {/* Availability Filter */}
                <button className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 hover:bg-gray-100 text-left transition-colors">
                  <span className="text-sm font-medium text-gray-700">Availability</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Industry Type Filter */}
                <button className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 hover:bg-gray-100 text-left transition-colors">
                  <span className="text-sm font-medium text-gray-700">Industry Type</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Budget Filter */}
                <button className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 hover:bg-gray-100 text-left transition-colors">
                  <span className="text-sm font-medium text-gray-700">Budget</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Ratings Filter */}
                <button className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 hover:bg-gray-100 text-left transition-colors">
                  <span className="text-sm font-medium text-gray-700">Ratings</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Speciality Filter */}
                <button className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 hover:bg-gray-100 text-left transition-colors">
                  <span className="text-sm font-medium text-gray-700">Speciality</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </aside>

          {/* Vendor Grid */}
          <main className="flex-1 w-full">
            {loading ? (
              <div className="flex items-center justify-center h-64 sm:h-96">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-sm sm:text-base text-gray-600 font-medium px-4">Finding perfect vendors for you...</p>
                </div>
              </div>
            ) : filteredVendors.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
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
