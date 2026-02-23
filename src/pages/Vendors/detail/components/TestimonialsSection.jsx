import StarIcon from '../../components/icons/StarIcon';
import useResponsiveCarousel from '../hooks/useResponsiveCarousel';
import { ChevronIcon } from './icons';

const TestimonialAvatar = ({ initials, featured = false }) => {
  const sizeClass = featured ? 'w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] text-[20px] sm:text-[22px]' : 'w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] text-[16px] sm:text-[18px]';

  return (
    <div
      className={`${sizeClass} rounded-full bg-[linear-gradient(150deg,#0A2540_0%,#3B5166_55%,#FFA077_100%)] text-white font-bold flex items-center justify-center shrink-0`}
    >
      {initials}
    </div>
  );
};

const TestimonialStars = ({ featured = false }) => {
  const size = featured ? 16 : 13;

  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon key={index} size={size} />
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial, featured = false }) => {
  if (!testimonial) {
    return (
      <article
        aria-hidden="true"
        className={`rounded-[12px] border border-transparent ${
          featured ? 'min-h-[320px] sm:min-h-[388px]' : 'min-h-[280px] sm:min-h-[332px]'
        } opacity-0`}
      />
    );
  }

  return (
    <article
      className={`rounded-[12px] bg-[#FCFCFC] border border-[#F1F1F1] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        featured ? 'p-5 sm:p-6 min-h-[320px] sm:min-h-[388px]' : 'p-4 min-h-[280px] sm:min-h-[332px]'
      }`}
    >
      <div className="flex items-start gap-3">
        <TestimonialAvatar initials={testimonial.initials} featured={featured} />

        <div>
          <h3 className={`${featured ? 'text-[18px]' : 'text-[16px] sm:text-[17px]'} font-bold text-black`}>{testimonial.author}</h3>
          <div className={`mt-1 flex flex-wrap items-center ${featured ? 'gap-5' : 'gap-3'}`}>
            <p className={`${featured ? 'text-[13px] sm:text-[14px]' : 'text-[11px]'} text-black`}>{testimonial.role}</p>
            <TestimonialStars featured={featured} />
          </div>
        </div>
      </div>

      <p className={`mt-4 sm:mt-5 ${featured ? 'text-[20px] sm:text-[24px]' : 'text-[15px]'} font-semibold text-black leading-[1.25]`}>
        {testimonial.headline}
      </p>
      <p
        className={`mt-3 sm:mt-4 ${featured ? 'text-[13px] sm:text-[14px]' : 'text-[11px]'} leading-[1.3] text-[#3B5166]`}
        style={
          featured
            ? undefined
            : {
                display: '-webkit-box',
                WebkitLineClamp: 8,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
        }
      >
        {testimonial.quote}
      </p>
    </article>
  );
};

const TestimonialsSection = ({ testimonials }) => {
  const hasTestimonials = testimonials.length > 0;

  const {
    visibleCount,
    startIndex,
    canGoPrevious,
    canGoNext,
    pageCount,
    previous,
    next,
    goTo,
  } = useResponsiveCarousel({
    itemsLength: testimonials.length,
    desktopVisible: 3,
    mobileVisible: 1,
  });

  if (!hasTestimonials) {
    return null;
  }

  const desktopPageCount = Math.max(testimonials.length - 2, 1);
  const desktopStartIndex = Math.min(startIndex, desktopPageCount - 1);
  const mobilePageCount = testimonials.length;
  const mobileStartIndex = Math.min(startIndex, mobilePageCount - 1);

  return (
    <section className="mt-8 sm:mt-10 pb-8 sm:pb-10">
      <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold text-[#3D464F]">What Our Clients Say About Us</h2>

      <div className="mt-8 overflow-hidden hidden lg:block">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${desktopPageCount * 100}%`,
            transform: `translate3d(-${desktopStartIndex * (100 / desktopPageCount)}%,0,0)`,
          }}
        >
          {Array.from({ length: desktopPageCount }).map((_, pageIndex) => (
            <div key={`testimonial-page-window-${pageIndex}`} className="shrink-0 px-2" style={{ width: `${100 / desktopPageCount}%` }}>
              <div className="grid grid-cols-[270px_minmax(0,420px)_270px] justify-center gap-8">
                <TestimonialCard testimonial={testimonials[pageIndex]} />
                <TestimonialCard testimonial={testimonials[pageIndex + 1]} featured />
                <TestimonialCard testimonial={testimonials[pageIndex + 2]} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-hidden lg:hidden">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${mobilePageCount * 100}%`,
            transform: `translate3d(-${mobileStartIndex * (100 / mobilePageCount)}%,0,0)`,
          }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="shrink-0 px-1" style={{ width: `${100 / mobilePageCount}%` }}>
              <TestimonialCard testimonial={testimonial} featured={visibleCount === 1} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-[16px] sm:gap-[24px]">
        <button
          type="button"
          onClick={previous}
          disabled={!canGoPrevious}
          className="h-[32px] w-[32px] sm:h-[36px] sm:w-[36px] flex items-center justify-center disabled:opacity-70"
          aria-label="Previous testimonials"
        >
          <ChevronIcon
            direction="left"
            className="w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]"
            color={!canGoPrevious ? '#E9EAEC' : '#535B64'}
          />
        </button>

        <div className="flex items-center gap-[10px] sm:gap-[14px]">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={`testimonial-page-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={`h-[12px] w-[12px] sm:h-[14px] sm:w-[14px] rounded-full ${
                startIndex === index ? 'bg-[#535B64]' : 'bg-[#E9EAEC]'
              }`}
              aria-label={`Go to testimonial page ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          disabled={!canGoNext}
          className="h-[32px] w-[32px] sm:h-[36px] sm:w-[36px] flex items-center justify-center disabled:opacity-70"
          aria-label="Next testimonials"
        >
          <ChevronIcon
            direction="right"
            className="w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]"
            color={!canGoNext ? '#E9EAEC' : '#535B64'}
          />
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
