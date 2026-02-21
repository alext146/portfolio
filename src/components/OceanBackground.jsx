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
        start: 0.05,
        end: 0.35,
        size: 180,
        x: '8%',
        y: '18%'
      },
      {
        src: '/assets/creatures/jellyfish.svg',
        alt: '',
        start: 0.35,
        end: 0.7,
        size: 170,
        x: '68%',
        y: '40%'
      },
      {
        src: '/assets/creatures/anglerfish.svg',
        alt: '',
        start: 0.7,
        end: 1,
        size: 200,
        x: '12%',
        y: '70%'
      }
    ],
    []
  );

  return (
    <div className="ocean-background" style={{ '--ocean-depth': depth }} aria-hidden="true">
      <div className="ocean-gradient" />
      <div className="ocean-light" />
      <div className="ocean-bubbles" />
      {creatures.map((creature) => {
        const opacity = getOpacity(depth, creature.start, creature.end);
        const t = clamp((depth - creature.start) / (creature.end - creature.start));
        const translateY = (t - 0.5) * 80;
        return (
          <img
            key={creature.src}
            src={creature.src}
            alt={creature.alt}
            className="ocean-creature"
            style={{
              width: creature.size,
              left: creature.x,
              top: creature.y,
              opacity,
              transform: `translateY(${translateY}px)`
            }}
          />
        );
      })}
    </div>
  );
}
