import { useEffect, useMemo, useRef, useState } from 'react';

const FISH_ICON_PATH =
  'M22,11.71C21.37,9.74,19,6,14.5,6A10.44,10.44,0,0,0,8.19,8.37a6.64,6.64,0,0,0-.9-.68,4.62,4.62,0,0,0-4.84,0A1,1,0,0,0,2,8.51,5.43,5.43,0,0,0,3.42,12,5.43,5.43,0,0,0,2,15.49a1,1,0,0,0,.45.83,4.6,4.6,0,0,0,4.84,0,5.4,5.4,0,0,0,.9-.67A10.44,10.44,0,0,0,14.5,18C19,18,21.37,14.26,22,12.29A1.14,1.14,0,0,0,22,11.71Z';

const SEAWEED_PATCH_COUNT = 5;
const WRAP_MARGIN = 160;
const MAX_TICK_DT = 0.05;
const THEME_META_SELECTOR = 'meta[name="theme-color"]';
const TURN_ORIGIN_TIP_RIGHT = '92%';
const TURN_ORIGIN_TIP_LEFT = '8%';
const SHARK_ENTRY_DELAY_MS = 1800;

const FISH_COLORS_BY_ZONE = {
  sunlight: '#214e66',
  twilight: '#1d435b',
  midnight: '#16354b',
  abyss: '#102737'
};

const SCHOOL_BLUEPRINTS = [
  { id: 'sunlight-a', zone: 'sunlight', y: 12, direction: 'right', count: 24, size: 9 },
  { id: 'sunlight-b', zone: 'sunlight', y: 21, direction: 'left', count: 22, size: 9 },
  { id: 'sunlight-c', zone: 'sunlight', y: 31, direction: 'right', count: 20, size: 9 },
  { id: 'twilight-a', zone: 'twilight', y: 44, direction: 'left', count: 7, size: 10 },
  { id: 'twilight-b', zone: 'twilight', y: 51, direction: 'right', count: 7, size: 10 },
  { id: 'midnight-a', zone: 'midnight', y: 63, direction: 'right', count: 6, size: 16 },
  { id: 'midnight-b', zone: 'midnight', y: 70, direction: 'left', count: 6, size: 15 },
  { id: 'abyss-a', zone: 'abyss', y: 79, direction: 'left', count: 5, size: 14 },
  { id: 'abyss-b', zone: 'abyss', y: 86, direction: 'right', count: 5, size: 13 },
  {
    id: 'seafloor-a',
    zone: 'abyss',
    y: 93,
    direction: 'left',
    count: 3,
    size: 10,
    color: '#8dc8db'
  },
  {
    id: 'seafloor-b',
    zone: 'abyss',
    y: 96,
    direction: 'right',
    count: 2,
    size: 9,
    color: '#a6deeb'
  }
];

const FEATURE_CREATURE_BLUEPRINTS = [
  {
    id: 'shark-sunlight',
    assetPath: 'assets/creatures/shark-silhouette.svg',
    alt: '',
    zone: 'sunlight',
    group: 'shark-sunlight',
    size: 54,
    y: '18%',
    direction: 'left',
    layer: 2,
    species: 'shark'
  },
  {
    id: 'shark-twilight',
    assetPath: 'assets/creatures/shark-silhouette.svg',
    alt: '',
    zone: 'twilight',
    group: 'shark-twilight',
    size: 50,
    y: '46%',
    direction: 'right',
    layer: 2,
    species: 'shark'
  },
  {
    id: 'anglerfish-a',
    assetPath: 'assets/creatures/angler.svg',
    alt: '',
    zone: 'abyss',
    group: 'angler',
    size: 32,
    y: '91%',
    direction: 'right',
    layer: 3,
    accent: 'lure',
    species: 'angler'
  },
  {
    id: 'anglerfish-b',
    assetPath: 'assets/creatures/angler.svg',
    alt: '',
    zone: 'abyss',
    group: 'angler',
    size: 28,
    y: '86%',
    direction: 'left',
    layer: 3,
    accent: 'lure',
    species: 'angler'
  },
  {
    id: 'anglerfish-c',
    assetPath: 'assets/creatures/angler.svg',
    alt: '',
    zone: 'midnight',
    group: 'angler',
    size: 26,
    y: '78%',
    direction: 'right',
    layer: 2,
    accent: 'lure',
    species: 'angler'
  },
  {
    id: 'anglerfish-d',
    assetPath: 'assets/creatures/angler.svg',
    alt: '',
    zone: 'abyss',
    group: 'angler-seafloor',
    size: 30,
    y: '95%',
    direction: 'left',
    layer: 1,
    accent: 'lure',
    species: 'angler'
  },
  {
    id: 'anglerfish-e',
    assetPath: 'assets/creatures/angler.svg',
    alt: '',
    zone: 'abyss',
    group: 'angler-seafloor',
    size: 27,
    y: '97%',
    direction: 'right',
    layer: 1,
    accent: 'lure',
    species: 'angler'
  }
];

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

const getThemeColor = (depth) => {
  const clampedDepth = clamp(depth);
  const lightness = 45 - clampedDepth * 30;
  return `hsl(190 85% ${lightness.toFixed(1)}%)`;
};

const createAssetResolver = (baseUrl) => (path) => `${baseUrl}${path.replace(/^\//, '')}`;

const createSeaweedPatches = (count = SEAWEED_PATCH_COUNT) => {
  const rng = seededRng(hashString('seaweed-patches-v1'));
  const patches = [];

  for (let index = 0; index < count; index += 1) {
    let leftValue = 10 + rng() * 80;
    const minSpacing = 6.2 + rng() * 4.2;
    let attempts = 0;

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

const buildSchoolCreatures = () => {
  return SCHOOL_BLUEPRINTS.flatMap((school) => {
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
        color: school.color || FISH_COLORS_BY_ZONE[school.zone]
      };
    });
  });
};

const buildFeatureCreatures = (asset) => {
  return FEATURE_CREATURE_BLUEPRINTS.map(({ assetPath, ...creature }) => ({
    ...creature,
    src: asset(assetPath),
    color: creature.species === 'shark' ? FISH_COLORS_BY_ZONE[creature.zone] : creature.color
  }));
};

const buildCreatures = (asset) => [...buildSchoolCreatures(), ...buildFeatureCreatures(asset)];

const createFishState = (creatures, viewport) => {
  return creatures.map((creature) => {
    const rng = seededRng(hashString(creature.id));
    const isSchoolFish = creature.kind === 'fish';
    const isShark = creature.species === 'shark';
    const groupRng = seededRng(hashString(`group-${creature.group || creature.id}`));
    const yUnit = percentToUnit(creature.y);
    const baseY = yUnit * viewport.height;
    const initialDirection = creature.direction === 'left' ? -1 : 1;
    const sharkSpawnOffset = WRAP_MARGIN + 56 + rng() * 120;
    const x = isShark
      ? initialDirection < 0
        ? viewport.width + sharkSpawnOffset
        : -sharkSpawnOffset
      : isSchoolFish
        ? groupRng() * (viewport.width * 1.06) - viewport.width * 0.03 + (rng() - 0.5) * 84
        : rng() * (viewport.width * 1.28) - viewport.width * 0.14;
    const y = baseY + (rng() - 0.5) * (isSchoolFish ? 44 : 68);
    const heading = initialDirection * (0.15 + rng() * 0.5);
    const speed = isSchoolFish ? 30 + rng() * 22 : 18 + rng() * 22;

    return {
      id: creature.id,
      group: creature.group || creature.id,
      isSchoolFish,
      isAngler: creature.species === 'angler',
      isShark,
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
};

const groupFishByGroup = (fishState) => {
  const groups = new Map();
  fishState.forEach((fish) => {
    if (!groups.has(fish.group)) groups.set(fish.group, []);
    groups.get(fish.group).push(fish);
  });
  return groups;
};

const applySchoolingForces = (fish, squad, dt) => {
  if (squad.length <= 1) return;

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

  if (count === 0) return;

  const cohesionX = (centerX / count - fish.x) * (fish.isSchoolFish ? 0.24 : 0.12);
  const cohesionY = (centerY / count - fish.y) * (fish.isSchoolFish ? 0.22 : 0.14);
  const alignmentX = (avgVx / count - fish.vx) * (fish.isSchoolFish ? 0.16 : 0.09);
  const alignmentY = (avgVy / count - fish.vy) * (fish.isSchoolFish ? 0.16 : 0.09);

  fish.vx += (cohesionX + alignmentX + separationX) * dt;
  fish.vy += (cohesionY + alignmentY + separationY) * dt;
};

const applyAnglerAvoidance = (fish, anglers, dt) => {
  if (!fish.isSchoolFish || anglers.length === 0) return 0;

  let fleeX = 0;
  let fleeY = 0;
  let panicLevel = 0;
  const fearRadius = 170 + fish.yUnit * 76;

  anglers.forEach((angler) => {
    const dx = fish.x - angler.x;
    const dy = fish.y - angler.y;
    const distSq = dx * dx + dy * dy;

    if (distSq < 1 || distSq > fearRadius * fearRadius) return;

    const dist = Math.sqrt(distSq);
    const fear = (fearRadius - dist) / fearRadius;
    fleeX += (dx / dist) * fear;
    fleeY += (dy / dist) * fear;
    panicLevel = Math.max(panicLevel, fear);
  });

  if (panicLevel > 0) {
    fish.vx += fleeX * dt * 148;
    fish.vy += fleeY * dt * 126;
  }

  return panicLevel;
};

const applySharkAvoidance = (fish, sharks, dt) => {
  if (!fish.isSchoolFish || sharks.length === 0) return 0;

  let fleeX = 0;
  let fleeY = 0;
  let sidestepX = 0;
  let sidestepY = 0;
  let panicLevel = 0;
  const fearRadius = 190 + fish.yUnit * 86;

  sharks.forEach((shark) => {
    const dx = fish.x - shark.x;
    const dy = fish.y - shark.y;
    const distSq = dx * dx + dy * dy;

    if (distSq < 1 || distSq > fearRadius * fearRadius) return;

    const dist = Math.sqrt(distSq);
    const fear = (fearRadius - dist) / fearRadius;
    const awayX = dx / dist;
    const awayY = dy / dist;

    const fishSpeed = Math.hypot(fish.vx, fish.vy);
    const forwardX = fishSpeed > 1 ? fish.vx / fishSpeed : fish.vx >= 0 ? 1 : -1;
    const forwardY = fishSpeed > 1 ? fish.vy / fishSpeed : 0;
    const behindFactor = clamp((forwardX * awayX + forwardY * awayY + 1) / 2, 0, 1);
    const boostedFear = fear * (1 + behindFactor * 0.75);

    fleeX += awayX * boostedFear;
    fleeY += awayY * boostedFear;

    const sidestepWeight = behindFactor * fear;
    sidestepX += -awayY * sidestepWeight;
    sidestepY += awayX * sidestepWeight;

    panicLevel = Math.max(panicLevel, boostedFear);
  });

  if (panicLevel > 0) {
    fish.vx += (fleeX * 166 + sidestepX * 84) * dt;
    fish.vy += (fleeY * 144 + sidestepY * 84) * dt;
  }

  return panicLevel;
};

const applyRandomTurn = (fish, dt, minSpeed, maxSpeed) => {
  fish.turnTimer -= dt;
  if (fish.turnTimer > 0) return;

  fish.turnTimer = fish.isSchoolFish ? 1.2 + Math.random() * 2.2 : 0.9 + Math.random() * 2.4;
  const turnJitter = fish.isSchoolFish ? 0.55 : 0.9;
  const angle = Math.atan2(fish.vy, fish.vx) + (Math.random() - 0.5) * turnJitter;
  const speed = clamp(Math.hypot(fish.vx, fish.vy), minSpeed, maxSpeed);

  fish.vx = Math.cos(angle) * speed;
  fish.vy = Math.sin(angle) * speed * (fish.isSchoolFish ? 0.58 : 0.7);
};

const applyDepthSteering = (fish, viewportHeight, dt) => {
  const baseY = fish.yUnit * viewportHeight;
  fish.vy += (baseY - fish.y) * (fish.isSchoolFish ? 0.36 : 0.25) * dt;
};

const applyDrift = (fish, dt) => {
  fish.vy += (Math.random() - 0.5) * fish.drift * (fish.isSchoolFish ? 1.2 : 1.8) * dt;
  fish.vx += (Math.random() - 0.5) * fish.drift * (fish.isSchoolFish ? 0.55 : 0.9) * dt;
};

const clampSpeed = (fish, minSpeed, maxSpeed) => {
  const speed = Math.hypot(fish.vx, fish.vy);

  if (speed > maxSpeed) {
    fish.vx = (fish.vx / speed) * maxSpeed;
    fish.vy = (fish.vy / speed) * maxSpeed;
  } else if (speed < minSpeed) {
    const fallbackDirection = fish.vx >= 0 ? 1 : -1;
    fish.vx = fallbackDirection * minSpeed;
    fish.vy *= 0.6;
  }
};

const advanceAndWrapPosition = (fish, viewport, dt) => {
  fish.x += fish.vx * dt;
  fish.y += fish.vy * dt;

  if (fish.x < -WRAP_MARGIN) {
    fish.x = viewport.width + WRAP_MARGIN;
  } else if (fish.x > viewport.width + WRAP_MARGIN) {
    fish.x = -WRAP_MARGIN;
  }

  if (fish.y < -WRAP_MARGIN) {
    fish.y = viewport.height + WRAP_MARGIN;
  } else if (fish.y > viewport.height + WRAP_MARGIN) {
    fish.y = -WRAP_MARGIN;
  }
};

const renderFishNode = (fish, laneMap, depthRef, scrollRef) => {
  const node = laneMap.get(fish.id);
  if (!node) return;

  const yaw = clamp((fish.vy / Math.max(Math.abs(fish.vx), 1)) * 12, -12, 12);
  const depthParallaxShift = (depthRef.current - 0.5) * -(8 + fish.yUnit * 22);
  const scrollParallaxShift = scrollRef.current * (0.02 + fish.yUnit * 0.026);
  const parallaxShift = depthParallaxShift - scrollParallaxShift;
  const facing = fish.vx < 0 ? -1 : 1;
  const facingForSpecies = fish.isShark ? -facing : facing;
  const baseYawForFacing = facingForSpecies < 0 ? -yaw : yaw;
  const yawForSpecies = fish.isShark ? -baseYawForFacing : baseYawForFacing;
  const noseDirection = fish.isShark ? facing : facingForSpecies;
  const turnOriginX =
    fish.isSchoolFish || fish.isShark
      ? noseDirection < 0
        ? TURN_ORIGIN_TIP_LEFT
        : TURN_ORIGIN_TIP_RIGHT
      : '50%';

  node.style.transform = `translate3d(${fish.x}px, ${fish.y + parallaxShift}px, 0)`;
  node.style.setProperty('--creature-facing', String(facingForSpecies));
  node.style.setProperty('--creature-yaw', `${yawForSpecies}deg`);
  node.style.setProperty('--creature-turn-origin-x', turnOriginX);
};

const getWrapperClassName = (creature) => {
  const classes = ['ocean-creature-wrapper', `ocean-creature-wrapper--${creature.zone}`];
  if (creature.accent === 'lure') classes.push('ocean-creature-wrapper--lure');
  if (creature.species === 'angler') classes.push('ocean-creature-wrapper--angler');
  if (creature.species === 'shark') classes.push('ocean-creature-wrapper--shark');
  return classes.join(' ');
};

const getImageClassName = (creature) => {
  const classes = ['ocean-creature', `ocean-creature--${creature.zone}`];
  if (creature.species === 'angler') classes.push('ocean-creature--angler');
  if (creature.species === 'shark') classes.push('ocean-creature--shark');
  return classes.join(' ');
};

export default function OceanBackground() {
  const [depth, setDepth] = useState(0);
  const [sharksVisible, setSharksVisible] = useState(false);
  const laneRefs = useRef(new Map());
  const depthRef = useRef(0);
  const scrollRef = useRef(0);
  const sharksVisibleRef = useRef(false);
  const backgroundRef = useRef(null);

  const asset = useMemo(() => createAssetResolver(import.meta.env.BASE_URL), []);

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
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateDepth);
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

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setSharksVisible(true);
    }, SHARK_ENTRY_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    sharksVisibleRef.current = sharksVisible;
  }, [sharksVisible]);

  useEffect(() => {
    const themeColorMeta = document.querySelector(THEME_META_SELECTOR);
    if (!themeColorMeta) return;
    themeColorMeta.setAttribute('content', getThemeColor(depth));
  }, [depth]);

  const seaweedPatches = useMemo(() => createSeaweedPatches(SEAWEED_PATCH_COUNT), []);
  const creatures = useMemo(() => buildCreatures(asset), [asset]);
  const seaweedSrc = useMemo(() => asset('assets/creatures/seaweed.svg'), [asset]);

  useEffect(() => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const fishState = createFishState(creatures, viewport);
    const groups = groupFishByGroup(fishState);
    const anglers = fishState.filter((fish) => fish.isAngler);
    const sharks = fishState.filter((fish) => fish.isShark);

    let rafId = 0;
    let lastTime = performance.now();

    const onResize = () => {
      viewport.width = window.innerWidth;
      viewport.height = window.innerHeight;
    };

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, MAX_TICK_DT);
      lastTime = now;

      fishState.forEach((fish) => {
        if (fish.isShark && !sharksVisibleRef.current) return;

        const squad = groups.get(fish.group) || [fish];
        const activeSharks = sharksVisibleRef.current ? sharks : [];

        applySchoolingForces(fish, squad, dt);
        const panicFromAnglers = applyAnglerAvoidance(fish, anglers, dt);
        const panicFromSharks = applySharkAvoidance(fish, activeSharks, dt);
        const panicLevel = Math.max(panicFromAnglers, panicFromSharks);

        let minSpeed = fish.speedMin;
        let maxSpeed = fish.speedMax;
        if (panicLevel > 0) {
          minSpeed += panicLevel * 18;
          maxSpeed += panicLevel * 14;
        }

        applyRandomTurn(fish, dt, minSpeed, maxSpeed);
        applyDepthSteering(fish, viewport.height, dt);
        applyDrift(fish, dt);
        clampSpeed(fish, minSpeed, maxSpeed);
        advanceAndWrapPosition(fish, viewport, dt);
        renderFishNode(fish, laneRefs.current, depthRef, scrollRef);
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
  const darkness = clamp(Math.pow(depth, 0.6) * 1.1);
  const zoneOpacities = getZoneOpacities(depth);

  return (
    <div
      ref={backgroundRef}
      className="ocean-background"
      style={{
        '--ocean-depth': depth,
        '--ocean-darkness': darkness,
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
              src={seaweedSrc}
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

      {creatures.map((creature) => {
        if (creature.species === 'shark' && !sharksVisible) return null;

        return (
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
              '--creature-facing':
                creature.species === 'shark'
                  ? creature.direction === 'left'
                    ? 1
                    : -1
                  : creature.direction === 'left'
                    ? -1
                    : 1,
              '--creature-yaw': '0deg',
            '--creature-turn-origin-x':
              creature.species === 'angler'
                ? '50%'
                : creature.species === 'shark'
                  ? creature.direction === 'left'
                    ? TURN_ORIGIN_TIP_LEFT
                    : TURN_ORIGIN_TIP_RIGHT
                : creature.direction === 'left'
                  ? TURN_ORIGIN_TIP_LEFT
                  : TURN_ORIGIN_TIP_RIGHT,
              zIndex: creature.layer,
              transform: 'translate3d(-220px, -220px, 0)'
            }}
          >
            <div className={getWrapperClassName(creature)}>
              {creature.kind === 'fish' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`ocean-creature ocean-creature--${creature.zone} ocean-creature--fish`}
                  style={{ color: creature.color }}
                >
                  <path d={FISH_ICON_PATH} />
                </svg>
              ) : creature.species === 'shark' ? (
                <span
                  aria-hidden="true"
                  className={getImageClassName(creature)}
                  style={{
                    color: creature.color,
                    '--shark-mask-image': `url(\"${creature.src}\")`
                  }}
                />
              ) : (
                <img src={creature.src} alt={creature.alt} className={getImageClassName(creature)} />
              )}
            </div>
          </div>
        );
      })}

      <div className="ocean-depth-dim" />
      <div className="ocean-foreground-haze" />
    </div>
  );
}
