const EmptyState = () => {
  return (
    <div className="flex items-center justify-center min-h-[340px] bg-white border border-[#E9EAEC] rounded-xl">
      <div className="text-center px-6">
        <p className="text-[22px] font-semibold text-[#3D464F] mb-2">No vendors found</p>
        <p className="text-[14px] text-[#697077]">Try adjusting your search query.</p>
      </div>
    </div>
  );
};

export default EmptyState;
