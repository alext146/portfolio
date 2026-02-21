const FULL_STACK_START_YEAR = 2023;
const yearsFullStack = Math.max(1, new Date().getFullYear() - FULL_STACK_START_YEAR);

export const profile = {
  name: 'Alex',
  role: 'Full Stack Engineer',
  stackLine: 'React | React Native | Node.js | Go',
  tagline: 'Engineering modern full-stack systems for operational reliability',
  heroDescription:
    'Focused on modernizing front-end systems and building real-time operational interfaces that prioritize performance, reliability, and maintainability. Partners closely with product, backend, and systems teams to deliver resilient software in privacy-conscious environments.',
  aboutDescription:
    'Strengths include front-end modernization with React and React Native, full-stack delivery with Node.js/Express and Go, and dependable engineering practices across CI/CD, testing, and system integration.',
  aboutCredential:
    'B.S. in Computer Science (Certified in Software Engineering).'
};

export const socialLinks = {
  github: 'https://github.com/alext146',
  linkedin: '',
  email: ''
};

export const contactNote =
  'For resume requests or more detailed project experience, feel free to reach out.';

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
];

export const heroStats = [
  { label: 'Focus', value: 'Frontend systems / Real-time interfaces' },
  { label: 'Stack', value: 'React + Node.js + Go' },
  { label: 'Experience', value: `${yearsFullStack}+ years full-stack` }
];

export const capabilities = [
  'Front-end modernization for large, evolving web applications',
  'Reliable operational interfaces for real-time workflows',
  'Performance optimization for constrained and high-reliability environments',
  'Cross-functional delivery across frontend, backend, and systems teams'
];

export const experience = [
  {
    title: 'Full Stack Engineer',
    org: 'Public Company (Autonomous Systems)',
    dates: 'Jul 2023 – Present',
    bullets: [
      'Modernized large legacy front-end systems to improve maintainability and delivery speed.',
      'Led development of core front-end workflows for internal operational and control interfaces.',
      'Optimized UI performance and stability for constrained, reliability-sensitive environments.',
      'Built and maintained internal tooling that improved developer and operator workflows.',
      'Collaborated closely with backend and systems teams to align interfaces with platform capabilities.'
    ]
  },
  {
    title: 'Lead Developer / Research Co-Author',
    org: 'Computer Science Department (Academic Research Collaboration)',
    dates: 'Jan 2023 – Jul 2023',
    bullets: [
      'Led a student team in an academic mobile application security research collaboration.',
      'Delivered a full-stack research platform using React Native, Node.js, and MongoDB.',
      'Supported publication work with structured analysis workflows and reproducible reporting.',
      'Coordinated milestones and communication across technical and academic stakeholders.'
    ]
  },
  {
    title: 'Software Engineering Intern',
    org: 'Top Right Corner',
    dates: 'Jun 2022 – Jan 2023',
    bullets: [
      'Supported VR product feature development across frontend and platform-facing workflows.',
      'Executed structured testing, documented defects, and partnered with engineers on fixes.',
      'Contributed to release readiness through QA feedback and implementation support.',
      'Assisted with technical and product-facing demos for partner and stakeholder presentations.'
    ]
  }
];

export const skillGroups = [
  {
    title: 'Frontend',
    items: [
      'React',
      'React Native',
      'JavaScript',
      'HTML/CSS',
      'MUI',
      'React Testing Library'
    ]
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'Go', 'PHP']
  },
  {
    title: 'DevOps / Infra',
    items: ['Docker', 'Jenkins', 'CI/CD', 'AWS', 'DigitalOcean']
  },
  {
    title: 'Data',
    items: ['MongoDB', 'MySQL']
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'Linux', 'WSL', 'WebSockets', 'VSCode']
  },
  {
    title: 'Quality',
    items: ['Jest', 'React Testing Library', 'TDD']
  }
];

export const projects = [
  {
    title: 'Data Visualization Tools',
    description:
      'Built real-time data visualization tools that translate operational inputs into clear visual context, helping teams monitor system state and make informed decisions.',
    stack: 'Web frontend, real-time data integration',
    link: null,
    image: null
  },
  {
    title: 'Tutor Center Scheduling App',
    description:
      'Served as team lead on a full-stack scheduling platform modernization, coordinating frontend and backend delivery while improving deployment consistency with CI/CD workflows.',
    stack: 'React Native, Node.js, Express, Docker, Jenkins',
    link: null,
    image: null
  },
  {
    title: 'Mobile App Security Research',
    description:
      'Collaborative academic project focused on mobile application security analysis, with a privacy-conscious full-stack implementation to support controlled research workflows.',
    stack: 'React Native, Node.js, MongoDB',
    link: null,
    image: null
  },
  {
    title: 'Legacy Projects',
    description:
      'Additional earlier projects span learning tools and small web/mobile builds that informed current full-stack engineering practices.',
    stack: 'Mixed web and mobile technologies',
    link: null,
    image: null
  }
];
