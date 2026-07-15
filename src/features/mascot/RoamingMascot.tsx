import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { MascotRenderer } from "./MascotRenderer";
import type { MascotMood, MascotReactionEvent } from "./mascot.types";
import type { ThemeId } from "../../themes/theme-types";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { parseCssTranslate, type MascotPoint } from "./mascot-position";
import "./roaming-mascot.css";

type Point = MascotPoint;
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
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
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
  if (!favourEdges) {
    return {
      x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
      y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
    };
  }

  const edge = Math.floor(Math.random() * 4);
  if (edge === 0 || edge === 1) {
    return {
      x: edge === 0 ? bounds.minX : bounds.maxX,
      y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
    };
  }
  return {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    y: edge === 2 ? bounds.minY : bounds.maxY,
  };
}

export function RoamingMascot({ themeId, mood, reaction, onReactionComplete }: RoamingMascotProps) {
  const handleRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<Size>({ width: 72, height: 72 });
  const positionRef = useRef<Point>({ x: EDGE_MARGIN, y: EDGE_MARGIN });
  const dragOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const pendingDragRef = useRef<Point | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const scheduleRoamRef = useRef<() => void>(() => undefined);
  const roamTimerRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const movementTimerRef = useRef<number | null>(null);
  const motionPreference = useMotionPreference();

  const applyPosition = useCallback((next: Point, durationMs = 0) => {
    const handle = handleRef.current;
    positionRef.current = next;
    if (!handle) return;
    if (movementTimerRef.current !== null) {
      window.clearTimeout(movementTimerRef.current);
      movementTimerRef.current = null;
    }
    handle.style.transitionDuration = `${durationMs}ms`;
    handle.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
    handle.dataset.moving = durationMs > 0 ? "true" : "false";
    if (durationMs > 0) {
      movementTimerRef.current = window.setTimeout(() => {
        movementTimerRef.current = null;
        if (handleRef.current) handleRef.current.dataset.moving = "false";
      }, durationMs + 50);
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (roamTimerRef.current !== null) window.clearTimeout(roamTimerRef.current);
    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
    if (movementTimerRef.current !== null) window.clearTimeout(movementTimerRef.current);
    roamTimerRef.current = null;
    resumeTimerRef.current = null;
    movementTimerRef.current = null;
    if (handleRef.current) handleRef.current.dataset.moving = "false";
  }, []);

  const scheduleRoam = useCallback(() => {
    if (draggingRef.current || motionPreference === "reduced" || document.hidden) return;
    const duration = Math.round(MIN_TRAVEL_MS + Math.random() * (MAX_TRAVEL_MS - MIN_TRAVEL_MS));
    applyPosition(randomDestination(sizeRef.current), duration);
    roamTimerRef.current = window.setTimeout(() => scheduleRoamRef.current(), duration + 500 + Math.random() * 1200);
  }, [applyPosition, motionPreference]);

  useEffect(() => {
    scheduleRoamRef.current = scheduleRoam;
  }, [scheduleRoam]);

  useIsomorphicLayoutEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    const rect = handle.getBoundingClientRect();
    sizeRef.current = { width: rect.width, height: rect.height };
    applyPosition({
      x: Math.max(EDGE_MARGIN, window.innerWidth - rect.width - 24),
      y: Math.max(EDGE_MARGIN, window.innerHeight - rect.height - 32),
    });
  }, [applyPosition, themeId]);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle || mood === "hidden") return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      sizeRef.current = { width: entry.contentRect.width, height: entry.contentRect.height };
      applyPosition(keepInViewport(positionRef.current, sizeRef.current));
    });
    resizeObserver.observe(handle);

    const startTimer = window.setTimeout(scheduleRoam, 900);
    const handleResize = () => applyPosition(keepInViewport(positionRef.current, sizeRef.current));
    const handleVisibility = () => {
      clearTimers();
      handle.dataset.suspended = document.hidden ? "true" : "false";
      if (!document.hidden && !draggingRef.current) scheduleRoam();
    };

    handle.dataset.suspended = document.hidden ? "true" : "false";
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearTimeout(startTimer);
      clearTimers();
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [applyPosition, clearTimers, mood, scheduleRoam]);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    clearTimers();
    draggingRef.current = true;
    const handle = event.currentTarget;
    const renderedPosition = parseCssTranslate(
      window.getComputedStyle(handle).transform,
    );
    if (renderedPosition) applyPosition(renderedPosition);
    handle.dataset.dragging = "true";
    handle.dataset.suspended = "true";
    handle.dataset.moving = "true";
    dragOffsetRef.current = {
      x: event.clientX - positionRef.current.x,
      y: event.clientY - positionRef.current.y,
    };
    handle.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    pendingDragRef.current = keepInViewport({
      x: event.clientX - dragOffsetRef.current.x,
      y: event.clientY - dragOffsetRef.current.y,
    }, sizeRef.current);
    if (dragFrameRef.current !== null) return;
    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = null;
      if (pendingDragRef.current) applyPosition(pendingDragRef.current);
    });
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    draggingRef.current = false;
    pendingDragRef.current = null;
    if (dragFrameRef.current !== null) window.cancelAnimationFrame(dragFrameRef.current);
    dragFrameRef.current = null;
    event.currentTarget.dataset.dragging = "false";
    event.currentTarget.dataset.suspended = "false";
    applyPosition(keepInViewport(positionRef.current, sizeRef.current), 220);
    resumeTimerRef.current = window.setTimeout(scheduleRoam, RESUME_DELAY_MS);
  };

  if (mood === "hidden") return null;

  return (
    <div className="roaming-mascot-layer" aria-hidden="true">
      <div
        ref={handleRef}
        className="roaming-mascot-handle"
        data-dragging="false"
        data-moving="false"
        data-suspended="false"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onTransitionEnd={(event) => {
          if (event.propertyName === "transform") {
            event.currentTarget.dataset.moving = "false";
          }
        }}
      >
        <MascotRenderer
          themeId={themeId}
          mood={mood}
          reaction={reaction}
          onReactionComplete={onReactionComplete}
        />
      </div>
    </div>
  );
}
