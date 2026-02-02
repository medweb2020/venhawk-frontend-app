import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import VendorCard from './components/VendorCard';
import { mockVendors } from './mockVendors';

/**
 * Vendors Page Component
 * @description Displays matched vendors with filters
 */
const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate API call to fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVendors(mockVendors);
      setLoading(false);
    };

    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Procurement</h1>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-80 flex-shrink-0">
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
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 font-medium">Finding perfect vendors for you...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
