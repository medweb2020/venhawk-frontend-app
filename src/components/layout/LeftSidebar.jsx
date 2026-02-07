/**
 * LeftSidebar Component
 * @description Common left sidebar showing how VenHawk matches vendors
 */
const LeftSidebar = () => {
  return (
    <div className="lg:w-[28%] px-8 py-8 lg:py-12 relative">
      {/* Decorative curved lines - fixed at viewport, limited height */}
      <div className="fixed top-0 left-0 w-[28%] h-[60vh] pointer-events-none opacity-40 hidden lg:block">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 400 600"
          fill="none"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <path
              key={i}
              d={`M 0 ${300 + i * 8} Q 100 ${250 + i * 8} 200 ${300 + i * 8} T 400 ${300 + i * 8}`}
              stroke={i < 20 ? '#9ca3af' : '#fb923c'}
              strokeWidth="1"
              fill="none"
              opacity={i < 20 ? 0.4 : 0.3}
            />
          ))}
        </svg>
      </div>

      {/* Vertical Progress Line - fixed at viewport */}
      <div className="hidden lg:block fixed top-0 left-[28%] h-screen w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-transparent"></div>

      <div className="relative z-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-10 leading-tight">
          How VenHawk Matches Vendors
        </h1>

        {/* Steps */}
        <div className="space-y-8 mb-10">
          {/* Step 1 */}
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#1a3a52] text-white flex items-center justify-center font-bold text-base">
                1
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Project signals are captured</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                We analyze your project objective, business needs, and constraints.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#1a3a52] text-white flex items-center justify-center font-bold text-base">
                2
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Vendors are scored for relevance</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Vendors are evaluated based on industry experience, project type, and delivery capability.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#1a3a52] text-white flex items-center justify-center font-bold text-base">
                3
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Best-fit vendors are shortlisted</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Only vendors aligned to your requirements are recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Matching Insight */}
        <div className="flex gap-4 items-start mt-10 pt-8 border-t border-gray-200">
          <div className="flex-shrink-0 mt-1">
            <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Matching Insight</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              More precise inputs result in higher-quality vendor matches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
