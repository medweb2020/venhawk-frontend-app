import PropTypes from 'prop-types';

const EmptyState = ({ title, description, actionLabel, onAction }) => {
  const canShowAction = typeof onAction === 'function' && actionLabel;

  return (
    <div className="flex items-center justify-center min-h-[340px] bg-white border border-[#E9EAEC] rounded-xl">
      <div className="text-center px-6">
        <p className="text-[22px] font-semibold text-[#3D464F] mb-2">{title}</p>
        <p className="text-[14px] text-[#697077]">{description}</p>

        {canShowAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 h-[36px] px-4 rounded-lg border border-[#D7DDE4] text-[13px] font-medium text-[#46505A] hover:bg-[#F5F6F8] transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

EmptyState.defaultProps = {
  title: 'No vendors found',
  description: 'Try adjusting your search query.',
  actionLabel: '',
  onAction: undefined,
};

export default EmptyState;
