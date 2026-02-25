const WRAP_MARGIN = 160;
const MAX_TICK_DT = 0.05;

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
  const fearRadius = 260 + fish.yUnit * 110;

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

    const sharkSpeed = Math.hypot(shark.vx, shark.vy);
    const sharkFwdX = sharkSpeed > 1 ? shark.vx / sharkSpeed : shark.vx >= 0 ? 1 : -1;
    const sharkFwdY = sharkSpeed > 1 ? shark.vy / sharkSpeed : 0;
    const inPathFactor = clamp((sharkFwdX * -awayX + sharkFwdY * -awayY + 0.3) / 1.3, 0, 1);

    const boostedFear = fear * (1 + behindFactor * 1.6 + inPathFactor * 1.2);

    fleeX += awayX * boostedFear;
    fleeY += awayY * boostedFear;

    const sidestepWeight = behindFactor * fear;
    sidestepX += -awayY * sidestepWeight;
    sidestepY += awayX * sidestepWeight;

    panicLevel = Math.max(panicLevel, boostedFear);
  });

  if (panicLevel > 0) {
    fish.vx += (fleeX * 240 + sidestepX * 140) * dt;
    fish.vy += (fleeY * 200 + sidestepY * 140) * dt;
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

let viewport = { width: 0, height: 0 };
let fishState = [];
let groups = new Map();
let anglers = [];
let sharks = [];
let sharksVisible = false;
let lastTime = 0;
let isActive = true;
const stats = {
  startedAt: 0,
  requestFrameMessages: 0,
  framesPosted: 0,
  ticks: 0,
  simStepMsTotal: 0,
  lastDtMs: 0
};

const resetStats = () => {
  stats.startedAt = performance.now();
  stats.requestFrameMessages = 0;
  stats.framesPosted = 0;
  stats.ticks = 0;
  stats.simStepMsTotal = 0;
  stats.lastDtMs = 0;
};

const snapshotStats = () => {
  const uptimeMs = stats.startedAt > 0 ? performance.now() - stats.startedAt : 0;
  return {
    uptimeMs,
    requestFrameMessages: stats.requestFrameMessages,
    framesPosted: stats.framesPosted,
    ticks: stats.ticks,
    simStepMsTotal: stats.simStepMsTotal,
    lastDtMs: stats.lastDtMs,
    fishCount: fishState.length,
    active: isActive,
    sharksVisible
  };
};

const postFrame = () => {
  stats.framesPosted += 1;
  self.postMessage({
    type: 'frame',
    fish: fishState.map((fish) => ({
      id: fish.id,
      x: fish.x,
      y: fish.y,
      vx: fish.vx,
      vy: fish.vy,
      yUnit: fish.yUnit,
      isShark: fish.isShark,
      isSchoolFish: fish.isSchoolFish
    }))
  });
};

const tick = (dt) => {
  if (fishState.length === 0 || !isActive || dt <= 0) return;
  stats.ticks += 1;
  stats.simStepMsTotal += dt * 1000;
  stats.lastDtMs = dt * 1000;

  const activeSharks = sharksVisible ? sharks : [];

  fishState.forEach((fish) => {
    if (fish.isShark && !sharksVisible) return;

    const squad = groups.get(fish.group) || [fish];

    applySchoolingForces(fish, squad, dt);
    const panicFromAnglers = applyAnglerAvoidance(fish, anglers, dt);
    const panicFromSharks = applySharkAvoidance(fish, activeSharks, dt);
    const panicLevel = Math.max(panicFromAnglers, panicFromSharks);

    let minSpeed = fish.speedMin;
    let maxSpeed = fish.speedMax;
    if (panicLevel > 0) {
      minSpeed += panicLevel * 28;
      maxSpeed += panicLevel * 22;
    }

    applyRandomTurn(fish, dt, minSpeed, maxSpeed);
    applyDepthSteering(fish, viewport.height, dt);
    applyDrift(fish, dt);
    clampSpeed(fish, minSpeed, maxSpeed);
    advanceAndWrapPosition(fish, viewport, dt);
  });
};

self.onmessage = (event) => {
  const { type, payload } = event.data || {};

  if (type === 'init') {
    resetStats();
    viewport = payload?.viewport || viewport;
    fishState = createFishState(payload?.creatures || [], viewport);
    groups = groupFishByGroup(fishState);
    anglers = fishState.filter((fish) => fish.isAngler);
    sharks = fishState.filter((fish) => fish.isShark);
    sharksVisible = Boolean(payload?.sharksVisible);
    isActive = payload?.active !== false;
    lastTime = performance.now();
    postFrame();
    return;
  }

  if (type === 'resize') {
    viewport = payload?.viewport || viewport;
    return;
  }

  if (type === 'set-sharks-visible') {
    sharksVisible = Boolean(payload?.visible);
    return;
  }

  if (type === 'set-active') {
    isActive = Boolean(payload?.active);
    if (isActive) {
      lastTime = performance.now();
    }
    return;
  }

  if (type === 'request-frame') {
    if (!isActive) return;
    stats.requestFrameMessages += 1;
    const now = performance.now();
    const elapsedMs = lastTime > 0 ? now - lastTime : 16.7;
    lastTime = now;
    const dt = Math.min(Math.max(elapsedMs, 0), MAX_TICK_DT * 1000) / 1000;
    tick(dt);
    postFrame();
    return;
  }

  if (type === 'get-stats') {
    self.postMessage({
      type: 'stats',
      stats: snapshotStats()
    });
    return;
  }

  if (type === 'stop') {
    fishState = [];
    groups = new Map();
    anglers = [];
    sharks = [];
    lastTime = 0;
    resetStats();
  }
};
