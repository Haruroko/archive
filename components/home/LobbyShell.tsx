"use client";

import Image from "next/image";
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import BackgroundSideBar from "../layout/aside/backgroundSideBar";
import Header from "../layout/header/Header";
import {
  createCursorFollowerState,
  defaultCursorFollowerOptions,
  updateCursorFollower,
} from "@/lib/cursorPhysics";
import Footer from "../layout/footer/Footer";
import Splash from "../splash/splash";
import MainSection from "./MainSection";

type LobbyShellProps = {
  backgrounds: string[];
};

const AUTO_ROTATE_MS = 8000;
const BACKGROUND_TRANSITION_MS = 600;
const CURSOR_CHARACTER_NORMAL_SRC = "/character/normal.png";
const CURSOR_CHARACTER_HOVER_SRC = "/character/hover.png";
const CURSOR_HIDE_DISTANCE = 280;
const CURSOR_SHOW_DISTANCE = 120;

function pickNextIndex(length: number, currentIndex: number, excludedIndexes: Array<number | null | undefined> = []) {
  if (length <= 1) {
    return currentIndex;
  }

  const excluded = new Set(
    excludedIndexes.filter((index): index is number => typeof index === "number" && index >= 0 && index < length),
  );
  let candidates = Array.from({ length }, (_, index) => index).filter((index) => !excluded.has(index));

  if (candidates.length === 0) {
    candidates = Array.from({ length }, (_, index) => index).filter((index) => index !== currentIndex);
  }

  if (candidates.length === 0) {
    return currentIndex;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function LobbyShell({ backgrounds }: LobbyShellProps) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const driftRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [follower, setFollower] = useState(() => createCursorFollowerState(160, 160));
  const targetRef = useRef({ x: 160, y: 160 });
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isCursorVisibleRef = useRef(true);
  const backgroundTimeoutRef = useRef<number | null>(null);
  const backgroundFrameRef = useRef<number | null>(null);
  const lastBackgroundIndexRef = useRef<number | null>(null);

  const activeBackground = backgrounds[activeIndex] ?? null;
  const previousBackground = previousIndex === null ? null : backgrounds[previousIndex] ?? null;

  useEffect(() => {
    isCursorVisibleRef.current = isCursorVisible;
  }, [isCursorVisible]);

  const previewBackgrounds = useMemo(
    () =>
      backgrounds.map((src, index) => ({
        id: `BG ${String(index + 1).padStart(2, "0")}`,
        src,
      })),
    [backgrounds],
  );

  const clearBackgroundTimers = useCallback(() => {
    if (backgroundTimeoutRef.current !== null) {
      window.clearTimeout(backgroundTimeoutRef.current);
      backgroundTimeoutRef.current = null;
    }

    if (backgroundFrameRef.current !== null) {
      window.cancelAnimationFrame(backgroundFrameRef.current);
      backgroundFrameRef.current = null;
    }
  }, []);

  const changeBackground = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;

    clearBackgroundTimers();
    lastBackgroundIndexRef.current = activeIndex;
    setPreviousIndex(activeIndex);
    setActiveIndex(nextIndex);
    setIsTransitioning(false);

    backgroundFrameRef.current = window.requestAnimationFrame(() => {
      backgroundFrameRef.current = null;
      setIsTransitioning(true);

      backgroundTimeoutRef.current = window.setTimeout(() => {
        backgroundTimeoutRef.current = null;
        setPreviousIndex(null);
        setIsTransitioning(false);
      }, BACKGROUND_TRANSITION_MS);
    });
  };

  const rotateRandomBackground = useEffectEvent(() => {
    changeBackground(pickNextIndex(backgrounds.length, activeIndex, [activeIndex, lastBackgroundIndexRef.current]));
  });

  useEffect(() => {
    if (!isAutoRotate || backgrounds.length <= 1) return;

    const interval = window.setInterval(() => {
      rotateRandomBackground();
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [isAutoRotate, backgrounds.length, activeIndex]);

  useEffect(() => clearBackgroundTimers, [clearBackgroundTimers]);

  useEffect(() => {

    const getRestingPoint = () => ({
      x: window.innerWidth - 96,
      y: window.innerHeight - 96,
    });

    const syncFollowerToTarget = () => {
      const restingPoint = getRestingPoint();
      targetRef.current = restingPoint;
      lastTimeRef.current = null;
      isCursorVisibleRef.current = true;
      setIsCursorVisible(true);
      setIsCursorHovering(false);
      setFollower(createCursorFollowerState(restingPoint.x, restingPoint.y));
    };

    const handlePointerMove = (event: PointerEvent) => {
      // 기존 커서 물리 엔진용 타겟 업데이트
      targetRef.current = {
        x: event.clientX + 12,
        y: event.clientY - 14,
      };

      // 2. 배경 움직임을 위한 오프셋 계산 (-0.5 ~ 0.5 범위)
      const moveX = (event.clientX / window.innerWidth) - 0.5;
      const moveY = (event.clientY / window.innerHeight) - 0.5;
      setMouseOffset({ x: moveX, y: moveY });

      updateInteractiveHover(document.elementFromPoint(event.clientX, event.clientY));
    };

    const isInteractiveCursorTarget = (element: Element | null) => {
      let current = element;

      while (current) {
        if (
          current.classList.contains("cursor-pointer") ||
          current.matches('button, a, [role="button"], input, select, textarea, summary')
        ) {
          return current;
        }
        current = current.parentElement;
      }

      return null;
    };

    const updateInteractiveHover = (eventTarget: Element | null) => {
      if (!(eventTarget instanceof Element)) {
        setIsCursorHovering(false);
        return;
      }

      setIsCursorHovering(Boolean(isInteractiveCursorTarget(eventTarget)));
    };

    const handlePointerLeave = () => {
      setIsCursorHovering(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastTimeRef.current = null;
      }
    };

    const handleWindowBlur = () => {
      lastTimeRef.current = null;
      setIsCursorHovering(false);
    };

    const handleWindowFocus = () => {
      lastTimeRef.current = null;
    };

    const animate = (timestamp: number) => {
      const previousTime = lastTimeRef.current ?? timestamp;
      const deltaTime = timestamp - previousTime;
      lastTimeRef.current = timestamp;
      driftRef.current += deltaTime * 0.00002;

      setFollower((current) => {
        const nextFollower = updateCursorFollower(
          current,
          targetRef.current,
          timestamp - previousTime,
          defaultCursorFollowerOptions,
        );

        const distance = Math.hypot(targetRef.current.x - nextFollower.x, targetRef.current.y - nextFollower.y);

        if (isCursorVisibleRef.current && distance > CURSOR_HIDE_DISTANCE) {
          isCursorVisibleRef.current = false;
          setIsCursorVisible(false);
        } else if (!isCursorVisibleRef.current && distance < CURSOR_SHOW_DISTANCE) {
          isCursorVisibleRef.current = true;
          setIsCursorVisible(true);
        }

        return nextFollower;
      });

      frameRef.current = window.requestAnimationFrame(animate);
    };

    syncFollowerToTarget();

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 스플래시 내부 애니메이션(0.5s)을 포함해 총 3초 뒤에 제거
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <Splash />}
      <div className="relative min-h-screen overflow-hidden font-sans text-slate-800">
        {/* 이전 배경: 새 배경이 들어올 때 0.6초 동안 빠르게 페이드 아웃 */}
        {previousIndex !== null && (
          <BackgroundLayer
            key={`prev-${previousIndex}`}
            src={backgrounds[previousIndex]}
            isVisible={!isTransitioning}
            mouseOffset={mouseOffset}
            drift={driftRef.current}
          />
        )}

        {/* 2. 현재 배경 (나타나는 레이어) */}
        <BackgroundLayer
          key={`active-${activeIndex}`}
          src={backgrounds[activeIndex]}
          isVisible={previousIndex === null || isTransitioning}
          mouseOffset={mouseOffset}
          drift={driftRef.current}
        />
        <CursorFollower
          x={follower.x}
          y={follower.y}
          rotation={follower.rotation}
          stretch={follower.stretch}
          wobbleX={follower.wobbleX}
          wobbleY={follower.wobbleY}
          isHovering={isCursorHovering}
          isVisible={isCursorVisible}
        />
        <div className="mx-auto flex min-h-[calc(100vh)] w-full max-w-full items-stretch justify-center">
          <main className="relative flex min-h-[calc(100vh)] w-full flex-1 flex-col justify-start overflow-hidden  border border-white/70 bg-white/1 shadow-[0_30px_120px_rgba(64,104,170,0.1)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.08))]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.34),transparent_12%),radial-gradient(circle_at_bottom_left,rgba(139,178,255,0.2),transparent_28%)]" />
            <Header />
              <MainSection/>
            <Footer />
          </main>
          <BackgroundSideBar
            activeIndex={activeIndex}
            isAutoRotate={isAutoRotate}
            setIsAutoRotate={setIsAutoRotate}
            previewBackgrounds={previewBackgrounds}
            changeBackground={changeBackground}
          />
        </div>
      </div>
    </>
  );
}

function CursorFollower({
  x,
  y,
  rotation,
  stretch,
  wobbleX,
  wobbleY,
  isHovering,
  isVisible,
}: {
  x: number;
  y: number;
  rotation: number;
  stretch: number;
  wobbleX: number;
  wobbleY: number;
  isHovering: boolean;
  isVisible: boolean;
}) {
  const currentImageSrc = isHovering ? CURSOR_CHARACTER_HOVER_SRC : CURSOR_CHARACTER_NORMAL_SRC;
  const hoverScale = isHovering ? 0.7 : 1;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) translate(-42%, -44%)`,
      }}
    >
      <div
        className={`relative transition-[opacity,transform] duration-300 ease-out ${isVisible ? "opacity-100" : "opacity-0"
          }`}
        style={{
          transform: `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate(${rotation}deg) scale(${stretch * hoverScale}, ${(2 - stretch) * hoverScale})`,
          transformOrigin: "center center",
        }}
      >
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/15 blur-xl" />
        <Image
          src={currentImageSrc}
          alt="cursor character"
          width={104}
          height={104}
          className="select-none drop-shadow-[0_10px_20px_rgba(24,34,54,0.28)]"
          priority
        />
      </div>
    </div>
  );
}

function BackgroundLayer({
  src,
  isVisible,
  mouseOffset,
  drift,
}: {
  src: string;
  isVisible: boolean;
  mouseOffset: { x: number; y: number };
  drift: number;
}) {
  const seed = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < src.length; i++) {
      hash = (hash << 5) - hash + src.charCodeAt(i);
      hash |= 0;
    }
    return (Math.abs(hash) % 1000) / 1000;
  }, [src]);

  // 2. 랜덤 값을 활용한 속성 부여
  // 방향 랜덤 (-1 또는 1)
  const direction = seed > 0.5 ? 1 : -1;
  // 속도 랜덤 (원래 속도의 0.5배 ~ 1.5배 사이)
  const speedFactor = 3 + seed;
  // 강도 랜덤
  const driftStrength = 30 + seed * 30; // 30 ~ 60 사이

  const mouseStrength = 20;

  // X축: 마우스 움직임 + (랜덤 방향 * 랜덤 속도 * 랜덤 강도)
  const translateX =
    (mouseOffset.x * mouseStrength) +
    (Math.sin(drift * speedFactor) * driftStrength * direction);

  const translateY = mouseOffset.y * mouseStrength;
  return (
    <div
      className={`absolute inset-0 bg-cover brightness-50 bg-center transition-opacity duration-[600ms] ease-in-out ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      style={{
        backgroundImage: `url("${src}")`,
        // scale을 1.15 정도로 넉넉히 주면 강한 랜덤 움직임에도 여백이 생기지 않습니다.
        transform: `scale(1.15) translate3d(${translateX}px, ${translateY}px, 0)`,
        willChange: "transform, opacity",
      }}
    />
  );
}
