/**
 * VendorCard Component
 * @description Displays a vendor's information in a card format
 */
const VendorCard = ({ vendor }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  const getMatchScoreColors = (score) => {
    if (score === null || score === undefined) return null;

    if (score >= 80) {
      return {
        bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
        text: 'text-white',
        ring: 'ring-green-200',
      };
    } else if (score >= 60) {
      return {
        bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        text: 'text-white',
        ring: 'ring-blue-200',
      };
    } else if (score >= 40) {
      return {
        bg: 'bg-gradient-to-br from-orange-400 to-orange-500',
        text: 'text-white',
        ring: 'ring-orange-200',
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-gray-400 to-gray-500',
        text: 'text-white',
        ring: 'ring-gray-200',
      };
    }
  };

  const matchColors = getMatchScoreColors(vendor.matchingScore);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200 relative">
      {/* Matching Score Badge */}
      {matchColors && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <div className={`${matchColors.bg} ${matchColors.text} px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ring-2 ${matchColors.ring} flex items-center gap-1`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{vendor.matchingScore}%</span>
          </div>
        </div>
      )}

      {/* Vendor Logo */}
      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        {vendor.logoUrl ? (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-white border border-gray-200">
            <img
              src={vendor.logoUrl}
              alt={`${vendor.name} logo`}
              className="w-full h-full object-contain p-1"
            />
          </div>
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
            {vendor.logo}
          </div>
        )}
        <div className="flex-1 min-w-0 pr-16 sm:pr-20">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 truncate">{vendor.name}</h3>
          <p className="text-xs text-gray-600 mb-0.5 truncate">{vendor.category}</p>
          <p className="text-xs text-gray-500 truncate">{vendor.location}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex">{renderStars(vendor.rating)}</div>
        <span className="text-xs sm:text-sm font-medium text-gray-700">{vendor.rating}</span>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{vendor.description}</p>

      {/* Specialty and Price */}
      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs text-gray-500 mb-0.5 sm:mb-1">Specialty</p>
          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{vendor.specialty}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500 mb-0.5 sm:mb-1">Start From</p>
          <p className="text-xs sm:text-sm font-semibold text-blue-600 whitespace-nowrap">{vendor.startFrom}</p>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
