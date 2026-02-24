import { useNavigate } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';

const VenAISearchBanner = () => {
  const navigate = useNavigate();
  const { resetProjectData } = useProject();

  const handleSearchClick = () => {
    resetProjectData();
    navigate('/');
  };

  return (
    <div className="relative overflow-hidden rounded-[12px] mb-6">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A2540_0%,#23364B_45%,#5A4C57_65%,#0A2540_100%)]" />
      <div className="relative px-6 py-8 md:px-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-[#FCFCFC] text-[24px] font-bold tracking-[-0.2px]">
          Let Ven AI find a perfect match for you!
        </h2>

        <button
          type="button"
          onClick={handleSearchClick}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-[14px] bg-white text-[#0A2540] text-[18px] font-semibold hover:bg-[#F5F6F8] transition-colors whitespace-nowrap"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search vendors with Ven AI
        </button>
      </div>
    </div>
  );
};

export default VenAISearchBanner;
