import PropTypes from 'prop-types';
import VendorCard from './VendorCard';

/**
 * VendorList Component
 * @description List container for displaying multiple vendor cards
 */
const VendorList = ({
  vendors = [],
  onViewDetails,
  onContact,
  emptyMessage = 'No vendors found. Refine your search and try again.',
}) => {
  if (vendors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor, index) => (
        <VendorCard
          key={vendor.id || index}
          vendor={vendor}
          onViewDetails={onViewDetails}
          onContact={onContact}
        />
      ))}
    </div>
  );
};

VendorList.propTypes = {
  vendors: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onContact: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
};

export default VendorList;
