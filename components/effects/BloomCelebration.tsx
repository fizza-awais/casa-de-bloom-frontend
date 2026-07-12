"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export type BloomCelebrationShape =
  | "petal"
  | "sparkle"
  | "heart"
  | "pearl"
  | "ribbon";

export interface BloomCelebrationHandle {
  celebrate: () => void;
}

interface BloomCelebrationProps {
  variant: "guest" | "volunteer";
  coverage?: "viewport" | "container";
}

interface BloomCelebrationPiece {
  id: string;
  shape: BloomCelebrationShape;
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
  fall: number;
  rotate: number;
  endScale: number;
}

const MOBILE_PIECE_COUNT = 24;
const DESKTOP_PIECE_COUNT = 32;
const PIECE_LIFETIME_MS = 8500;

const SHAPE_WEIGHTS: Record<
  BloomCelebrationProps["variant"],
  Array<[BloomCelebrationShape, number]>
> = {
  guest: [
    ["petal", 0.4],
    ["sparkle", 0.3],
    ["heart", 0.1],
    ["pearl", 0.15],
    ["ribbon", 0.05],
  ],
  volunteer: [
    ["petal", 0.4],
    ["sparkle", 0.3],
    ["heart", 0.1],
    ["pearl", 0.15],
    ["ribbon", 0.05],
  ],
};

const SHAPE_COLORS: Record<BloomCelebrationShape, string[]> = {
  petal: ["#ff3f82", "#ff9fbd", "#f7bfd1", "#b52c5d"],
  sparkle: ["#d6a84b", "#e7c579", "#f3d9a4"],
  heart: ["#ff5f94", "#e9477d", "#b52c5d"],
  pearl: ["#fffaf5", "#f8eee8", "#f4dfd6"],
  ribbon: ["#c99743", "#d93470", "#f0c98d"],
};

let burstSequence = 0;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function buildShapePool(
  variant: BloomCelebrationProps["variant"],
  count: number,
) {
  const allocations = SHAPE_WEIGHTS[variant].map(([shape, weight]) => {
    const exactCount = count * weight;
    return {
      shape,
      count: Math.floor(exactCount),
      remainder: exactCount - Math.floor(exactCount),
    };
  });
  let remaining =
    count - allocations.reduce((total, item) => total + item.count, 0);

  [...allocations]
    .sort((a, b) => b.remainder - a.remainder)
    .forEach((item) => {
      if (remaining <= 0) return;
      item.count += 1;
      remaining -= 1;
    });

  const pool = allocations.flatMap(({ shape, count: shapeCount }) =>
    Array.from({ length: shapeCount }, () => shape),
  );

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool;
}

function pieceSize(shape: BloomCelebrationShape) {
  switch (shape) {
    case "petal":
      return randomBetween(10, 16);
    case "sparkle":
      return randomBetween(7, 12);
    case "heart":
      return randomBetween(8, 12);
    case "pearl":
      return randomBetween(6, 10);
    default:
      return randomBetween(7, 11);
  }
}

function buildBloomCelebration(
  variant: BloomCelebrationProps["variant"],
  count: number,
): BloomCelebrationPiece[] {
  const burstId = `${Date.now()}-${burstSequence++}`;
  const shapes = buildShapePool(variant, count);

  return Array.from({ length: count }, (_, index) => {
    const shape = shapes[index];
    const palette = SHAPE_COLORS[shape];
    const drift = randomBetween(-58, 58);
    const fall = randomBetween(82, 112);
    const rotate = randomBetween(-135, 135);

    return {
      id: `${burstId}-${index}`,
      shape,
      left: randomBetween(4, 96),
      size: pieceSize(shape),
      color: palette[Math.floor(Math.random() * palette.length)],
      delay: randomBetween(0, 0.75),
      duration: randomBetween(5.2, 7.4),
      drift,
      fall,
      rotate,
      endScale: randomBetween(0.86, 1.14),
    };
  });
}

const BloomCelebration = forwardRef<
  BloomCelebrationHandle,
  BloomCelebrationProps
>(function BloomCelebration(
  { variant, coverage = "container" },
  ref,
) {
  const [pieces, setPieces] = useState<BloomCelebrationPiece[]>([]);
  const cleanupTimers = useRef<Set<number>>(new Set());

  const celebrate = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const burst = buildBloomCelebration(
      variant,
      isMobile ? MOBILE_PIECE_COUNT : DESKTOP_PIECE_COUNT,
    );
    const burstIds = new Set(burst.map((piece) => piece.id));

    setPieces((current) => [...current.slice(-DESKTOP_PIECE_COUNT), ...burst]);

    const timer = window.setTimeout(() => {
      cleanupTimers.current.delete(timer);
      setPieces((current) =>
        current.filter((piece) => !burstIds.has(piece.id)),
      );
    }, PIECE_LIFETIME_MS);
    cleanupTimers.current.add(timer);
  }, [variant]);

  useImperativeHandle(ref, () => ({ celebrate }), [celebrate]);

  useEffect(() => {
    const timers = cleanupTimers.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <div
      className={`bloom-celebration-layer pointer-events-none inset-0 z-30 overflow-hidden ${
        coverage === "viewport" ? "fixed" : "absolute"
      }`}
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="bloom-celebration-piece"
          style={
            {
              left: `${piece.left}%`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--bloom-color": piece.color,
              "--bloom-drift": `${piece.drift}px`,
              "--bloom-fall": `${piece.fall}vh`,
              "--bloom-rotate": `${piece.rotate}deg`,
              "--bloom-end-scale": piece.endScale,
            } as CSSProperties
          }
        >
          <span className={`bloom-shape bloom-shape-${piece.shape}`} />
        </span>
      ))}
    </div>
  );
});

export default BloomCelebration;
