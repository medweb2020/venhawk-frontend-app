import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import { useVendorDetail } from '../hooks/useVendorDetail';
import CaseStudiesSection from './components/CaseStudiesSection';
import GoBackButton from './components/GoBackButton';
import KeyClientsSection from './components/KeyClientsSection';
import TestimonialsSection from './components/TestimonialsSection';
import VendorActionPanel from './components/VendorActionPanel';
import VendorProfilePanel from './components/VendorProfilePanel';
import { CASE_STUDIES, KEY_CLIENTS, TESTIMONIALS } from './data/staticContent';

const VendorDetail = () => {
  const navigate = useNavigate();
  const { vendorId, projectId } = useParams();

  const { vendor, loading, error } = useVendorDetail(vendorId);

  const handleBack = () => {
    if (projectId) {
      navigate(`/projects/${encodeURIComponent(projectId)}/vendors`);
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7]">
      <Header />

      <div className="max-w-[1280px] mx-auto px-3 sm:px-8 pt-5 sm:pt-8 pb-10 sm:pb-12">
        <GoBackButton onClick={handleBack} />

        {loading ? (
          <div className="mt-10 rounded-[12px] border border-[#E9EAEC] bg-white/70 py-16" />
        ) : error ? (
          <div className="mt-10 rounded-[12px] border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : !vendor ? (
          <div className="mt-10 rounded-[12px] border border-[#E9EAEC] bg-white py-16 text-center text-[#697077]">
            Vendor not found.
          </div>
        ) : (
          <>
            <section className="mt-6 sm:mt-8 flex flex-col xl:flex-row gap-5 sm:gap-6 xl:gap-[25px] justify-between">
              <VendorProfilePanel vendor={vendor} />
              <VendorActionPanel vendor={vendor} />
            </section>

            <div className="mt-6 sm:mt-8 h-[2px] w-full rounded-full bg-[#E9EAEC]" />

            <KeyClientsSection clients={KEY_CLIENTS} />
            <CaseStudiesSection studies={CASE_STUDIES} />
            <TestimonialsSection testimonials={TESTIMONIALS} />
          </>
        )}
      </div>
    </div>
  );
};

export default VendorDetail;
