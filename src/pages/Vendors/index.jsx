import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Header from '../../components/layout/Header';
import { vendorsAPI } from '../../services/api';
import EmptyState from './components/EmptyState';
import FiltersPanel from './components/FiltersPanel';
import VendorCard from './components/VendorCard';
import VenAISearchBanner from './components/VenAISearchBanner';

const Vendors = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadListingVendors = async () => {
      try {
        setLoading(true);
        setError('');

        const accessToken = await getAccessTokenSilently();
        const response = await vendorsAPI.getListing(accessToken);

        if (isMounted) {
          setVendors(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load vendors.');
          setVendors([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadListingVendors();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

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
          <FiltersPanel />

          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center min-h-[320px] bg-white rounded-xl border border-[#E9EAEC]">
                <p className="text-[14px] font-medium text-[#697077]">Loading vendors...</p>
              </div>
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
