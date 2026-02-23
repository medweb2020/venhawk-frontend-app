import { ArrowLeftIcon } from './icons';

const GoBackButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-3 sm:gap-4 text-[15px] sm:text-[16px] text-[#3B5166] hover:text-[#0A2540] transition-colors"
    >
      <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[10px] sm:rounded-[12px] border border-[#E9EAEC] bg-[#FCFCFC]">
        <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </span>
      <span>Go Back</span>
    </button>
  );
};

export default GoBackButton;
