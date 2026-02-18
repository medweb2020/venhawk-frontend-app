const CaseStudiesSection = ({ studies }) => {
  return (
    <section className="mt-10">
      <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold text-[#3D464F]">Case Studies</h2>

      <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {studies.map((study) => (
          <article key={study.id} className="h-full rounded-[6px] bg-[#FCFCFC] p-4 border border-[#F1F1F1]">
            <h3 className="text-[14px] font-semibold text-[#535B64] leading-[1.3]">{study.title}</h3>
            <p className="mt-4 text-[14px] leading-[1.3] text-[#535B64]">{study.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CaseStudiesSection;
