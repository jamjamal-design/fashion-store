"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

export function LuxuryCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0, active: false });
  const frameRef = useRef<number | null>(null);
  const nextRef = useRef<PointerState>(pointer);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setEnabled(query.matches && !reduced.matches);
    sync();

    query.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const updatePointer = (event: PointerEvent) => {
      nextRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: Boolean((event.target as HTMLElement | null)?.closest("button, a, input, select, textarea, summary, [role='button']")),
      };

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        setPointer(nextRef.current);
        frameRef.current = null;
      });
    };

    const handleLeave = () => {
      setPointer((current) => ({ ...current, active: false }));
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerdown", updatePointer, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", updatePointer);
      window.removeEventListener("pointerleave", handleLeave);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled]);

  if (!enabled || prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <motion.div
        className="luxury-cursor luxury-cursor-ring"
        animate={{ x: pointer.x - 18, y: pointer.y - 18, scale: pointer.active ? 1.45 : 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.2 }}
      />
      <motion.div
        className="luxury-cursor luxury-cursor-glow"
        animate={{ x: pointer.x - 42, y: pointer.y - 42, scale: pointer.active ? 1.1 : 0.95, opacity: pointer.active ? 0.7 : 0.45 }}
        transition={{ type: "spring", stiffness: 140, damping: 20, mass: 0.25 }}
      />
    </>
  );
}