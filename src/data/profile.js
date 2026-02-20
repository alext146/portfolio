export const profile = {
  name: 'Alex Trahan',
  role: 'Software developer',
  tagline: 'Building web apps and interactive experiences',
  heroDescription:
    'Skilled in modernizing front-end architectures and building responsive, real-time interfaces for high-reliability systems. Comfortable in performance- and stability-critical environments, including control systems and embedded-adjacent platforms.',
  aboutDescription:
    'Proficient in React, JavaScript, Node.js, PHP, Java, React Native, Linux/WSL2, AWS, Docker, MySQL, Git, CI/CD (Jenkins), Jest, TDD, and Atlassian tools. B.S. Computer Science — Certified in Software Engineering (University of New Orleans).'
};

export const socialLinks = {
  github: 'https://github.com/adtrahan146',
  linkedin: 'https://www.linkedin.com/in/alext146/'
};

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' }
];

export const heroStats = [
  { label: 'Focus', value: 'Real-time web interfaces' },
  { label: 'Stack', value: 'React + Node.js' },
  { label: 'Availability', value: 'Open to opportunities' }
];

export const capabilities = [
  'Modernizing front-end architectures and component libraries',
  'Responsive, real-time interfaces for high-reliability systems',
  'Performance and stability for control-system / embedded-adjacent platforms'
];

export const skillGroups = [
  {
    title: 'Frontend',
    items: ['React', 'JavaScript', 'React Native', 'HTML/CSS']
  },
  {
    title: 'Backend',
    items: ['Node.js', 'PHP', 'Java', 'MySQL']
  },
  {
    title: 'DevOps',
    items: ['AWS', 'Docker', 'CI/CD (Jenkins)']
  },
  {
    title: 'Quality + Tools',
    items: ['Git', 'Jest', 'TDD', 'Atlassian', 'Linux', 'WSL2']
  }
];

export const projects = [
  {
    title: 'War Empathy',
    description:
      'An HTML-based RPG with minimal CSS styling to bring awareness to geopolitical crises.',
    stack: 'HTML, CSS',
    link: 'https://github.com/adtrahan146/war-emp',
    image: '/assets/waremp.png'
  },
  {
    title: 'End Game Maps',
    description:
      'Full stack map app using Leaflet.js and user-generated pins. Early full-stack milestone.',
    stack: 'JavaScript',
    link: 'https://github.com/adtrahan146/EndGameMaps',
    image: '/assets/7115707.jpg'
  },
  {
    title: 'Rock, Paper, Scissors',
    description: 'A small rock/paper/scissors single-page app using DOM events.',
    stack: 'JavaScript',
    link: 'https://github.com/adtrahan146/RockPaperScissors',
    image: '/assets/rockpaperscissorsicon.png'
  },
  {
    title: "The People's Insight",
    description: "News app that pulls the day's top posts from various news subreddits.",
    stack: 'JavaScript',
    link: 'https://github.com/adtrahan146/the-peoples-insight',
    image: '/assets/peoples.png'
  }
];

export const blogPosts = [
  {
    title: 'Portfolio Website Devlog',
    subtitle: 'Notes from building this portfolio site.',
    link: 'https://docs.google.com/document/d/1OxFO_R4YZP1QzMNrB0sCyI87syE3TAy_kpWyo8SOU0k/edit?usp=sharing',
    image: '/assets/uno.jpg'
  },
  {
    title: 'EndGameMaps Announcement',
    subtitle: 'Full-stack map application overview.',
    link: 'https://docs.google.com/document/d/1oj_e-kd38ggQmj2Wall5zBMYDalq_x8YiLDmpq7b-tE/edit?usp=sharing',
    image: '/assets/7115707.jpg'
  },
  {
    title: 'RockPaperScissors Devlog',
    subtitle: 'Quick build log for the RPS mini-app.',
    link: 'https://docs.google.com/document/d/19n0ggmBQJdqIEKKHmK_aFBFLt4RfmzJUzTo4D_qUBKo/edit?usp=sharing',
    image: '/assets/rock-paper-scissors.png'
  },
  {
    title: 'Russian Revolution Research',
    subtitle: 'Research paper written during my Political Science studies.',
    link: 'https://docs.google.com/document/d/1qPNUk5y2OdoBan4WULltoVwxgttHU7Nrv7F1-n-MaBc/edit?usp=sharing',
    image: '/assets/imperial-flag.jpg'
  }
];
