export type CursorFollowerState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  stretch: number;
  wobbleX: number;
  wobbleY: number;
};

export type CursorFollowerTarget = {
  x: number;
  y: number;
};

export type CursorFollowerOptions = {
  stiffness: number;
  damping: number;
  mass: number;
  rotationFactor: number;
  stretchFactor: number;
  maxRotation: number;
  minStretch: number;
  maxStretch: number;
  wobbleFactorX: number;
  wobbleFactorY: number;
  wobbleDamping: number;
  wobbleReturn: number;
};

export const defaultCursorFollowerOptions: CursorFollowerOptions = {
  stiffness: 13.5,
  damping: 0.85,
  mass: 1,
  rotationFactor: 0.026,
  stretchFactor: 0.0042,
  maxRotation: 24,
  minStretch: 0.9,
  maxStretch: 1.14,
  wobbleFactorX: 0.035,
  wobbleFactorY: 0.02,
  wobbleDamping: 0.84,
  wobbleReturn: 0.18,
};

export function createCursorFollowerState(x = 0, y = 0): CursorFollowerState {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    rotation: 0,
    stretch: 1,
    wobbleX: 0,
    wobbleY: 0,
  };
}

export function updateCursorFollower(
  state: CursorFollowerState,
  target: CursorFollowerTarget,
  deltaMs: number,
  options: CursorFollowerOptions = defaultCursorFollowerOptions,
): CursorFollowerState {
  const dt = Math.min(deltaMs / 16.6667, 2.5);
  const dx = target.x - state.x;
  const dy = target.y - state.y;

  const ax = (dx * options.stiffness) / options.mass;
  const ay = (dy * options.stiffness) / options.mass;

  const vx = (state.vx + ax * dt) * options.damping;
  const vy = (state.vy + ay * dt) * options.damping;

  const x = state.x + vx * dt;
  const y = state.y + vy * dt;

  const rotation = clamp(vx * options.rotationFactor, -options.maxRotation, options.maxRotation);
  const speed = Math.hypot(vx, vy);
  const stretch = clamp(1 + speed * options.stretchFactor, options.minStretch, options.maxStretch);
  const wobbleX = (state.wobbleX - vx * options.wobbleFactorX) * options.wobbleDamping;
  const wobbleY =
    (state.wobbleY - vy * options.wobbleFactorY - state.wobbleY * options.wobbleReturn) *
    options.wobbleDamping;

  return {
    x,
    y,
    vx,
    vy,
    rotation,
    stretch,
    wobbleX,
    wobbleY,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
