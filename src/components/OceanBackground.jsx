import { useEffect, useMemo, useState } from 'react';

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const getOpacity = (depth, start, end) => {
  if (depth < start || depth > end) return 0;
  const t = clamp((depth - start) / (end - start));
  return Math.sin(t * Math.PI);
};

export default function OceanBackground() {
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateDepth = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setDepth(clamp(progress));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateDepth);
      }
    };

    updateDepth();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const creatures = useMemo(
    () => [
      {
        src: '/assets/creatures/surface-dolphin.svg',
        alt: '',
        start: 0.02,
        end: 0.28,
        size: 160,
        x: '10%',
        y: '10%',
        duration: 14,
        delay: -3
      },
      {
        src: '/assets/creatures/sea-turtle.svg',
        alt: '',
        start: 0.08,
        end: 0.32,
        size: 140,
        x: '68%',
        y: '16%',
        duration: 16,
        delay: -6
      },
      {
        src: '/assets/creatures/manta-ray.svg',
        alt: '',
        start: 0.22,
        end: 0.6,
        size: 200,
        x: '18%',
        y: '48%',
        duration: 18,
        delay: -5
      },
      {
        src: '/assets/creatures/jellyfish.svg',
        alt: '',
        start: 0.35,
        end: 0.72,
        size: 150,
        x: '70%',
        y: '46%',
        duration: 13,
        delay: -2
      },
      {
        src: '/assets/creatures/anglerfish.svg',
        alt: '',
        start: 0.62,
        end: 1,
        size: 180,
        x: '14%',
        y: '80%',
        duration: 20,
        delay: -9
      },
      {
        src: '/assets/creatures/squid.svg',
        alt: '',
        start: 0.7,
        end: 1,
        size: 190,
        x: '72%',
        y: '82%',
        duration: 22,
        delay: -11
      }
    ],
    []
  );

  return (
    <div className="ocean-background" style={{ '--ocean-depth': depth }} aria-hidden="true">
      <div className="ocean-gradient" />
      <div className="ocean-light" />
      <div className="ocean-bubbles" />
      <div className="ocean-depth-haze" />
      {creatures.map((creature) => {
        const opacity = getOpacity(depth, creature.start, creature.end);
        const t = clamp((depth - creature.start) / (creature.end - creature.start));
        const translateY = (t - 0.5) * 80;
        return (
          <div
            key={creature.src}
            className="ocean-creature-wrapper"
            style={{
              width: creature.size,
              left: creature.x,
              top: creature.y,
              opacity,
              animationDuration: `${creature.duration}s`,
              animationDelay: `${creature.delay}s`
            }}
          >
            <img
              src={creature.src}
              alt={creature.alt}
              className="ocean-creature"
              style={{ transform: `translateY(${translateY}px)` }}
            />
          </div>
        );
      })}
    </div>
  );
}
