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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200 relative">
      {/* Tier Badge */}
      <div className="absolute top-4 right-4 bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
        {vendor.tier}
      </div>

      {/* Vendor Logo */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {vendor.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-gray-900 mb-1">{vendor.name}</h3>
          <p className="text-xs text-gray-600 mb-0.5">{vendor.category}</p>
          <p className="text-xs text-gray-500">{vendor.location}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex">{renderStars(vendor.rating)}</div>
        <span className="text-sm font-medium text-gray-700">{vendor.rating}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vendor.description}</p>

      {/* Specialty and Price */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Specialty</p>
          <p className="text-sm font-medium text-gray-900">{vendor.specialty}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Start From</p>
          <p className="text-sm font-semibold text-blue-600">{vendor.startFrom}</p>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
