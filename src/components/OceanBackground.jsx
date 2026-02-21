import { useEffect, useMemo, useRef, useState } from 'react';

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const percentToUnit = (value, fallback = 0.5) => {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric / 100 : fallback;
};

const hashString = (value) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededRng = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

const smoothstep = (start, end, value) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

const getZoneOpacities = (depth) => {
  const sunlight = 1 - smoothstep(0.22, 0.34, depth);
  const twilight = smoothstep(0.2, 0.34, depth) * (1 - smoothstep(0.5, 0.64, depth));
  const midnight = smoothstep(0.48, 0.62, depth) * (1 - smoothstep(0.76, 0.9, depth));
  const abyss = smoothstep(0.74, 0.88, depth);

  return { sunlight, twilight, midnight, abyss };
};

const FISH_ICON_PATH =
  'M22,11.71C21.37,9.74,19,6,14.5,6A10.44,10.44,0,0,0,8.19,8.37a6.64,6.64,0,0,0-.9-.68,4.62,4.62,0,0,0-4.84,0A1,1,0,0,0,2,8.51,5.43,5.43,0,0,0,3.42,12,5.43,5.43,0,0,0,2,15.49a1,1,0,0,0,.45.83,4.6,4.6,0,0,0,4.84,0,5.4,5.4,0,0,0,.9-.67A10.44,10.44,0,0,0,14.5,18C19,18,21.37,14.26,22,12.29A1.14,1.14,0,0,0,22,11.71Z';

const createSeaweedPatches = (count = 5) => {
  const rng = seededRng(hashString('seaweed-patches-v1'));
  const patches = [];

  for (let index = 0; index < count; index += 1) {
    let leftValue = 10 + rng() * 80;
    const minSpacing = 6.2 + rng() * 4.2;
    let attempts = 0;

    // Keep a little spacing so "random" still reads clearly.
    while (
      attempts < 12 &&
      patches.some((patch) => Math.abs(patch.leftValue - leftValue) < minSpacing)
    ) {
      leftValue = 8 + rng() * 84;
      attempts += 1;
    }

    const xUnit = leftValue / 100;
    const sandContour =
      24 +
      Math.sin(xUnit * Math.PI * 2.1 + 0.35) * 7.5 +
      Math.cos(xUnit * Math.PI * 0.85 + 1.2) * 3.5;
    const bottomValue = clamp(sandContour + rng() * 18, 14, 56);

    patches.push({
      id: `seaweed-${index + 1}`,
      leftValue,
      left: `${leftValue.toFixed(2)}%`,
      bottom: `${bottomValue.toFixed(2)}%`,
      size: Math.round(68 + rng() * 36),
      sway: Number((7 + rng() * 2.8).toFixed(2)),
      delay: Number((rng() * -4.6).toFixed(2)),
      tilt: Math.round((rng() - 0.5) * 14)
    });
  }

  return patches
    .sort((a, b) => a.leftValue - b.leftValue)
    .map(({ leftValue, ...patch }) => patch);
};

export default function OceanBackground() {
  const [depth, setDepth] = useState(0);
  const laneRefs = useRef(new Map());
  const depthRef = useRef(0);
  const scrollRef = useRef(0);
  const backgroundRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateDepth = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setDepth(clamp(progress));
      scrollRef.current = scrollTop;
      if (backgroundRef.current) {
        backgroundRef.current.style.setProperty('--ocean-scroll-y', `${scrollTop}px`);
      }
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

  useEffect(() => {
    depthRef.current = depth;
  }, [depth]);

  const seaweedPatches = useMemo(() => createSeaweedPatches(5), []);

  const creatures = useMemo(() => {
    const fishColorByZone = {
      sunlight: '#214e66',
      twilight: '#1d435b',
      midnight: '#16354b',
      abyss: '#102737'
    };

    const schoolBlueprints = [
      { id: 'sunlight-a', zone: 'sunlight', y: 12, direction: 'right', count: 8, size: 22 },
      { id: 'sunlight-b', zone: 'sunlight', y: 21, direction: 'left', count: 7, size: 20 },
      { id: 'sunlight-c', zone: 'sunlight', y: 31, direction: 'right', count: 7, size: 19 },
      { id: 'twilight-a', zone: 'twilight', y: 44, direction: 'left', count: 7, size: 18 },
      { id: 'twilight-b', zone: 'twilight', y: 51, direction: 'right', count: 7, size: 17 },
      { id: 'midnight-a', zone: 'midnight', y: 63, direction: 'right', count: 6, size: 16 },
      { id: 'midnight-b', zone: 'midnight', y: 70, direction: 'left', count: 6, size: 15 },
      { id: 'abyss-a', zone: 'abyss', y: 79, direction: 'left', count: 5, size: 14 },
      { id: 'abyss-b', zone: 'abyss', y: 86, direction: 'right', count: 5, size: 13 }
    ];

    const schools = schoolBlueprints.flatMap((school) => {
      const rng = seededRng(hashString(`school-${school.id}`));

      return Array.from({ length: school.count }, (_, index) => {
        const yOffset = (rng() - 0.5) * 5;
        const sizeJitter = (rng() - 0.5) * 5;
        const yUnit = clamp((school.y + yOffset) / 100, 0.05, 0.95);
        const oppositeDirection = school.direction === 'left' ? 'right' : 'left';
        const direction = rng() > 0.9 ? oppositeDirection : school.direction;

        return {
          id: `school-${school.id}-${index + 1}`,
          kind: 'fish',
          alt: '',
          zone: school.zone,
          group: `school-${school.id}`,
          size: clamp(Math.round(school.size + sizeJitter), 9, 28),
          y: `${(yUnit * 100).toFixed(2)}%`,
          direction,
          color: fishColorByZone[school.zone]
        };
      });
    });

    return [
      ...schools,
      {
        id: 'anglerfish',
        src: '/assets/creatures/angler.svg',
        alt: '',
        zone: 'abyss',
        group: 'angler',
        size: 32,
        y: '91%',
        direction: 'right',
        layer: 3,
        accent: 'lure'
      }
    ];
  }, []);

  useEffect(() => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    const fishState = creatures.map((creature) => {
      const rng = seededRng(hashString(creature.id));
      const isSchoolFish = creature.kind === 'fish';
      const groupRng = seededRng(hashString(`group-${creature.group || creature.id}`));
      const yUnit = percentToUnit(creature.y);
      const baseY = yUnit * viewport.height;
      const x = isSchoolFish
        ? groupRng() * (viewport.width * 1.06) - viewport.width * 0.03 + (rng() - 0.5) * 84
        : rng() * (viewport.width * 1.28) - viewport.width * 0.14;
      const y = baseY + (rng() - 0.5) * (isSchoolFish ? 44 : 68);
      const initialDirection = creature.direction === 'left' ? -1 : 1;
      const heading = initialDirection * (0.15 + rng() * 0.5);
      const speed = isSchoolFish ? 30 + rng() * 22 : 18 + rng() * 22;

      return {
        id: creature.id,
        group: creature.group || creature.id,
        isSchoolFish,
        yUnit,
        x,
        y,
        vx: Math.cos(heading) * speed * initialDirection,
        vy: Math.sin(heading) * speed * (isSchoolFish ? 0.44 : 0.52),
        speedMin: isSchoolFish ? 24 + rng() * 6 : 14 + rng() * 4,
        speedMax: isSchoolFish ? 52 + rng() * 12 : 34 + rng() * 10,
        drift: isSchoolFish ? 0.24 + rng() * 0.36 : 0.4 + rng() * 0.8,
        turnTimer: isSchoolFish ? 1.1 + rng() * 2.1 : 0.5 + rng() * 1.8
      };
    });

    let rafId = 0;
    let lastTime = performance.now();

    const onResize = () => {
      viewport.width = window.innerWidth;
      viewport.height = window.innerHeight;
      fishState.forEach((fish) => {
        fish.y = clamp(fish.y, 24, viewport.height - 20);
      });
    };

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const margin = 160;
      const groups = new Map();

      fishState.forEach((fish) => {
        if (!groups.has(fish.group)) groups.set(fish.group, []);
        groups.get(fish.group).push(fish);
      });

      fishState.forEach((fish) => {
        const squad = groups.get(fish.group) || [fish];

        if (squad.length > 1) {
          let centerX = 0;
          let centerY = 0;
          let avgVx = 0;
          let avgVy = 0;
          let separationX = 0;
          let separationY = 0;
          let count = 0;

          squad.forEach((mate) => {
            if (mate === fish) return;
            centerX += mate.x;
            centerY += mate.y;
            avgVx += mate.vx;
            avgVy += mate.vy;
            count += 1;

            const dx = fish.x - mate.x;
            const dy = fish.y - mate.y;
            const distSq = dx * dx + dy * dy;
            const separationRadius = fish.isSchoolFish ? 86 : 130;
            if (distSq > 1 && distSq < separationRadius * separationRadius) {
              const dist = Math.sqrt(distSq);
              const push = (separationRadius - dist) / separationRadius;
              separationX += (dx / dist) * push * (fish.isSchoolFish ? 14 : 22);
              separationY += (dy / dist) * push * (fish.isSchoolFish ? 12 : 18);
            }
          });

          if (count > 0) {
            const cohesionX = (centerX / count - fish.x) * (fish.isSchoolFish ? 0.24 : 0.12);
            const cohesionY = (centerY / count - fish.y) * (fish.isSchoolFish ? 0.22 : 0.14);
            const alignmentX = (avgVx / count - fish.vx) * (fish.isSchoolFish ? 0.16 : 0.09);
            const alignmentY = (avgVy / count - fish.vy) * (fish.isSchoolFish ? 0.16 : 0.09);

            fish.vx += (cohesionX + alignmentX + separationX) * dt;
            fish.vy += (cohesionY + alignmentY + separationY) * dt;
          }
        }

        fish.turnTimer -= dt;
        if (fish.turnTimer <= 0) {
          fish.turnTimer = fish.isSchoolFish ? 1.2 + Math.random() * 2.2 : 0.9 + Math.random() * 2.4;
          const turnJitter = fish.isSchoolFish ? 0.55 : 0.9;
          const angle = Math.atan2(fish.vy, fish.vx) + (Math.random() - 0.5) * turnJitter;
          const speed = clamp(Math.hypot(fish.vx, fish.vy), fish.speedMin, fish.speedMax);
          fish.vx = Math.cos(angle) * speed;
          fish.vy = Math.sin(angle) * speed * (fish.isSchoolFish ? 0.58 : 0.7);
        }

        const baseY = fish.yUnit * viewport.height;
        fish.vy += (baseY - fish.y) * (fish.isSchoolFish ? 0.36 : 0.25) * dt;
        fish.vy += (Math.random() - 0.5) * fish.drift * (fish.isSchoolFish ? 1.2 : 1.8) * dt;
        fish.vx += (Math.random() - 0.5) * fish.drift * (fish.isSchoolFish ? 0.55 : 0.9) * dt;

        const speed = Math.hypot(fish.vx, fish.vy);
        if (speed > fish.speedMax) {
          fish.vx = (fish.vx / speed) * fish.speedMax;
          fish.vy = (fish.vy / speed) * fish.speedMax;
        } else if (speed < fish.speedMin) {
          const fallbackDirection = fish.vx >= 0 ? 1 : -1;
          fish.vx = fallbackDirection * fish.speedMin;
          fish.vy *= 0.6;
        }

        fish.x += fish.vx * dt;
        fish.y += fish.vy * dt;

        if (fish.x < -margin) {
          fish.x = viewport.width + margin;
          fish.y = baseY + (Math.random() - 0.5) * (fish.isSchoolFish ? 44 : 70);
        } else if (fish.x > viewport.width + margin) {
          fish.x = -margin;
          fish.y = baseY + (Math.random() - 0.5) * (fish.isSchoolFish ? 44 : 70);
        }

        fish.y = clamp(fish.y, 20, viewport.height - 18);

        const node = laneRefs.current.get(fish.id);
        if (!node) return;
        const yaw = clamp((fish.vy / Math.max(Math.abs(fish.vx), 1)) * 12, -12, 12);
        const depthParallaxShift = (depthRef.current - 0.5) * -(8 + fish.yUnit * 22);
        const scrollParallaxShift = scrollRef.current * (0.02 + fish.yUnit * 0.026);
        const parallaxShift = depthParallaxShift - scrollParallaxShift;
        node.style.transform = `translate3d(${fish.x}px, ${fish.y + parallaxShift}px, 0) rotate(${yaw}deg)`;
        node.style.setProperty('--creature-facing', fish.vx < 0 ? '-1' : '1');
      });

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('resize', onResize);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [creatures]);

  const bottomReveal = clamp((depth - 0.82) / 0.16);
  const zoneOpacities = getZoneOpacities(depth);

  return (
    <div
      ref={backgroundRef}
      className="ocean-background"
      style={{
        '--ocean-depth': depth,
        '--ocean-bottom': bottomReveal,
        '--ocean-parallax': depth - 0.5,
        '--ocean-scroll-y': '0px'
      }}
      aria-hidden="true"
    >
      <div className="ocean-gradient" />
      <div className="ocean-light" />
      <div className="ocean-bubbles" />
      <div className="ocean-depth-haze" />
      <div className="ocean-seafloor">
        <div className="ocean-seafloor__flora">
          {seaweedPatches.map((patch) => (
            <img
              key={patch.id}
              src="/assets/creatures/seaweed.svg"
              alt=""
              className="ocean-seaweed"
              style={{
                left: patch.left,
                bottom: patch.bottom,
                '--seaweed-size': `${patch.size}px`,
                '--seaweed-tilt': `${patch.tilt}deg`,
                animationDuration: `${patch.sway}s`,
                animationDelay: `${patch.delay}s`
              }}
            />
          ))}
        </div>
      </div>
      {creatures.map((creature) => (
        <div
          key={creature.id}
          ref={(node) => {
            if (node) {
              laneRefs.current.set(creature.id, node);
            } else {
              laneRefs.current.delete(creature.id);
            }
          }}
          className="ocean-creature-lane"
          style={{
            '--creature-size': `${creature.size}px`,
            opacity: zoneOpacities[creature.zone],
            '--creature-facing': creature.direction === 'left' ? -1 : 1,
            zIndex: creature.layer,
            transform: 'translate3d(-220px, -220px, 0)'
          }}
        >
          <div
            className={`ocean-creature-wrapper ocean-creature-wrapper--${creature.zone}${
              creature.accent === 'lure' ? ' ocean-creature-wrapper--lure' : ''
            }${creature.id === 'anglerfish' ? ' ocean-creature-wrapper--angler' : ''}`}
          >
            {creature.kind === 'fish' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`ocean-creature ocean-creature--${creature.zone} ocean-creature--fish`}
                style={{ color: creature.color }}
              >
                <path d={FISH_ICON_PATH} />
              </svg>
            ) : (
              <img
                src={creature.src}
                alt={creature.alt}
                className={`ocean-creature ocean-creature--${creature.zone}${
                  creature.id === 'anglerfish' ? ' ocean-creature--angler' : ''
                }`}
              />
            )}
          </div>
        </div>
      ))}
      <div className="ocean-depth-dim" />
      <div className="ocean-foreground-haze" />
    </div>
  );
}
