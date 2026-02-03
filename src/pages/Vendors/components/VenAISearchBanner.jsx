import { useNavigate } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';

/**
 * VenAISearchBanner Component
 * @description Search banner to start a new vendor search with VenAI
 */
const VenAISearchBanner = () => {
  const navigate = useNavigate();
  const { resetProjectData } = useProject();

  const handleSearchClick = () => {
    // Clear all project data
    resetProjectData();

    // Navigate to landing page to start new search
    navigate('/');
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 sm:p-8 mb-6 sm:mb-8 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Text Content */}
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Let VenAI find a perfect match for you!
          </h2>
          <p className="text-blue-100 text-sm sm:text-base">
            Get personalized vendor recommendations powered by AI
          </p>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search vendors with VenAI
        </button>
      </div>
    </div>
  );
};

export default VenAISearchBanner;
