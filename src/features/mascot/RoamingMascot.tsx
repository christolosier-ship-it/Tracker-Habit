import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { DashboardMascot } from "./DashboardMascot";
import type {
  MascotMood,
  MascotReactionEvent,
} from "./mascot.types";
import type { ThemeId } from "../../themes/theme-types";
import "./roaming-mascot.css";

type Point = { x: number; y: number };
type Size = { width: number; height: number };

type RoamingMascotProps = {
  themeId: ThemeId;
  mood: MascotMood;
  reaction?: MascotReactionEvent | null;
  onReactionComplete?: (reactionId: number) => void;
};

const EDGE_MARGIN = 14;
const RESUME_DELAY_MS = 1100;
const MIN_TRAVEL_MS = 4200;
const MAX_TRAVEL_MS = 7800;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function viewportBounds(size: Size) {
  return {
    minX: EDGE_MARGIN,
    minY: EDGE_MARGIN,
    maxX: Math.max(EDGE_MARGIN, window.innerWidth - size.width - EDGE_MARGIN),
    maxY: Math.max(EDGE_MARGIN, window.innerHeight - size.height - EDGE_MARGIN),
  };
}

function keepInViewport(point: Point, size: Size): Point {
  const bounds = viewportBounds(size);
  return {
    x: clamp(point.x, bounds.minX, bounds.maxX),
    y: clamp(point.y, bounds.minY, bounds.maxY),
  };
}

function randomDestination(size: Size): Point {
  const bounds = viewportBounds(size);
  const favourEdges = Math.random() < 0.68;

  if (favourEdges) {
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) {
      return { x: bounds.minX, y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY) };
    }
    if (edge === 1) {
      return { x: bounds.maxX, y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY) };
    }
    if (edge === 2) {
      return { x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX), y: bounds.minY };
    }
    return { x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX), y: bounds.maxY };
  }

  return {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
  };
}

export function RoamingMascot({
  themeId,
  mood,
  reaction,
  onReactionComplete,
}: RoamingMascotProps) {
  const handleRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<Size>({ width: 72, height: 72 });
  const positionRef = useRef<Point>({ x: EDGE_MARGIN, y: EDGE_MARGIN });
  const dragOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const roamTimerRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const [position, setPosition] = useState<Point>({ x: EDGE_MARGIN, y: EDGE_MARGIN });
  const [travelDuration, setTravelDuration] = useState(0);
  const [dragging, setDragging] = useState(false);

  const updatePosition = useCallback((next: Point) => {
    positionRef.current = next;
    setPosition(next);
  }, []);

  const clearTimers = useCallback(() => {
    if (roamTimerRef.current !== null) window.clearTimeout(roamTimerRef.current);
    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
    roamTimerRef.current = null;
    resumeTimerRef.current = null;
  }, []);

  const scheduleRoam = useCallback(() => {
    if (prefersReducedMotion() || document.hidden) return;

    const duration = Math.round(
      MIN_TRAVEL_MS + Math.random() * (MAX_TRAVEL_MS - MIN_TRAVEL_MS),
    );
    setTravelDuration(duration);
    updatePosition(randomDestination(sizeRef.current));

    roamTimerRef.current = window.setTimeout(() => {
      scheduleRoam();
    }, duration + 500 + Math.random() * 1200);
  }, [updatePosition]);

  useLayoutEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    const rect = handle.getBoundingClientRect();
    sizeRef.current = { width: rect.width, height: rect.height };
    updatePosition({
      x: Math.max(EDGE_MARGIN, window.innerWidth - rect.width - 24),
      y: Math.max(EDGE_MARGIN, window.innerHeight - rect.height - 32),
    });
  }, [themeId, updatePosition]);

  useEffect(() => {
    const startTimer = window.setTimeout(scheduleRoam, 900);

    const handleResize = () => {
      const handle = handleRef.current;
      if (handle) {
        const rect = handle.getBoundingClientRect();
        sizeRef.current = { width: rect.width, height: rect.height };
      }
      setTravelDuration(0);
      updatePosition(keepInViewport(positionRef.current, sizeRef.current));
    };

    const handleVisibility = () => {
      clearTimers();
      if (!document.hidden && !dragging) scheduleRoam();
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(startTimer);
      clearTimers();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [clearTimers, dragging, scheduleRoam, updatePosition]);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    clearTimers();
    setTravelDuration(0);
    setDragging(true);
    dragOffsetRef.current = {
      x: event.clientX - positionRef.current.x,
      y: event.clientY - positionRef.current.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updatePosition(
      keepInViewport(
        {
          x: event.clientX - dragOffsetRef.current.x,
          y: event.clientY - dragOffsetRef.current.y,
        },
        sizeRef.current,
      ),
    );
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragging(false);
    setTravelDuration(220);
    updatePosition(keepInViewport(positionRef.current, sizeRef.current));
    resumeTimerRef.current = window.setTimeout(scheduleRoam, RESUME_DELAY_MS);
  };

  if (mood === "hidden") return null;

  return (
    <div className="roaming-mascot-layer" aria-hidden="true">
      <div
        ref={handleRef}
        className="roaming-mascot-handle"
        data-dragging={dragging ? "true" : "false"}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transitionDuration: dragging ? "0ms" : `${travelDuration}ms`,
        }}
      >
        <DashboardMascot
          themeId={themeId}
          mood={mood}
          reaction={reaction}
          onReactionComplete={onReactionComplete}
        />
      </div>
    </div>
  );
}
