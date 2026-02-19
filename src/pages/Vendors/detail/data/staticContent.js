import attLogo from '../../../../assets/clients/at-t.svg';
import hiltonLogo from '../../../../assets/clients/hilton.svg';
import hpLogo from '../../../../assets/clients/hp.svg';
import stateStreetLogo from '../../../../assets/clients/state-street.svg';
import verizonLogo from '../../../../assets/clients/verizon.svg';

export const VENDOR_PAGE_COPY = {
  demoPrompt: 'You can always request a demo from this vendor!',
};

export const KEY_CLIENTS = [
  {
    id: 'hp',
    label: 'HP',
    logoSrc: hpLogo,
    logoClassName: 'h-[64px] sm:h-[72px] w-auto object-contain',
  },
  {
    id: 'verizon',
    label: 'Verizon',
    logoSrc: verizonLogo,
    logoClassName: 'h-[48px] sm:h-[56px] w-auto object-contain',
  },
  {
    id: 'state-street',
    label: 'State Street',
    logoSrc: stateStreetLogo,
    logoClassName: 'h-[54px] sm:h-[62px] w-auto object-contain',
  },
  {
    id: 'att',
    label: 'AT&T',
    logoSrc: attLogo,
    logoClassName: 'h-[52px] sm:h-[60px] w-auto object-contain',
  },
  {
    id: 'hilton',
    label: 'Hilton',
    logoSrc: hiltonLogo,
    logoClassName: 'h-[46px] sm:h-[52px] w-auto object-contain',
  },
];

export const CASE_STUDIES = [
  {
    id: 'study-1',
    title: 'Why do we use it?',
    summary:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    id: 'study-2',
    title: 'Fast-Paced Startup',
    summary:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    id: 'study-3',
    title: 'Streamlining Project Management for a Global Tech Firm',
    summary:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
];

export const TESTIMONIALS = [
  {
    id: 'testimonial-2',
    author: 'Samuel Moore',
    role: 'CIO',
    headline: 'Great Work!',
    quote:
      'Highly professional vendor with a strong focus on quality and customer satisfaction. They handled our CRM integration with great care, ensuring seamless integration with our existing systems. Their after-sales support is equally commendable.',
    initials: 'SM',
  },
  {
    id: 'testimonial-1',
    author: 'Edward Evans',
    role: 'VP of Engineering',
    headline: 'It was a very good experience',
    quote:
      'The vendor delivered an exceptional HCM software replacement project. Their understanding of our unique requirements and ability to customize the solution was impressive. Communication was clear and consistent throughout the project.',
    initials: 'EE',
  },
  {
    id: 'testimonial-3',
    author: 'Anthony Cook',
    role: 'IT PMO Director',
    headline: 'Over all Experience was good',
    quote:
      'We engaged this vendor for a digital transformation project, and they exceeded our expectations. Their innovative solutions and attention to detail helped us modernize our operations significantly. Would definitely work with them again.',
    initials: 'AC',
  },
  {
    id: 'testimonial-4',
    author: 'Nina Patel',
    role: 'Chief Operations Officer',
    headline: 'Reliable delivery partner',
    quote:
      'From kickoff to go-live, the team stayed responsive and proactive. Their ability to break complex tasks into practical phases reduced risk and gave our internal teams confidence through every milestone.',
    initials: 'NP',
  },
  {
    id: 'testimonial-5',
    author: 'Liam Harris',
    role: 'Head of Technology',
    headline: 'Excellent project governance',
    quote:
      'Their delivery model brought strong governance, clear weekly reporting, and transparent risk management. We always knew where things stood, and that made executive updates very straightforward.',
    initials: 'LH',
  },
  {
    id: 'testimonial-6',
    author: 'Ava Thompson',
    role: 'Director of IT',
    headline: 'Strong technical depth',
    quote:
      'The team quickly understood our architecture and gave practical recommendations we could execute without major disruption. Their technical depth was clear from the first workshop.',
    initials: 'AT',
  },
  {
    id: 'testimonial-7',
    author: 'Noah Reed',
    role: 'Program Manager',
    headline: 'Very collaborative team',
    quote:
      'They worked as an extension of our internal team and adapted quickly when scope shifted. Collaboration across product, engineering, and operations felt smooth throughout the engagement.',
    initials: 'NR',
  },
];
