"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

export type RevealDirection = "up" | "left" | "right" | "scale" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation direction. Defaults to "up" (fade + translateY). */
  direction?: RevealDirection;
  /** Delay in seconds before the reveal transition starts once in view. */
  delay?: number;
  /** Transition duration in seconds. Keep between 0.6 and 0.9 for the luxury feel. */
  duration?: number;
  /** CSS easing curve. Defaults to a smooth ease-out (no overshoot). */
  easing?: string;
  /** Semantic HTML element to render. Defaults to "div". */
  as?: ElementType;
  /** IntersectionObserver threshold (0–1). Defaults to 0.12. */
  threshold?: number;
  /** Root margin string passed to IntersectionObserver. */
  rootMargin?: string;
  /** Play the animation only once. Defaults to true. */
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Elegant scroll-triggered reveal animation.
 *
 * Elements start slightly below their final position with reduced opacity and
 * float upward into place as they enter the viewport. Each element animates
 * independently with its own duration / delay, and every animation plays only
 * once (the observer is disconnected after the first reveal).
 *
 * Duration and delay are driven by CSS custom properties so the browser can
 * keep the animation on the compositor thread at 60 FPS.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  easing = "cubic-bezier(0.22, 1, 0.36, 1)",
  as: Tag = "div",
  threshold = 0.12,
  rootMargin = "0px 0px -8% 0px",
  once = true,
  className = "",
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion immediately — show content without animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Trigger the reveal by adding the "revealed" class. The transition
        // (including the per-element delay) is handled entirely in CSS, which
        // keeps the main thread free for smooth scrolling.
        el.classList.add("revealed");
        if (once) {
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  const dirClass =
    direction === "up"
      ? "reveal"
      : direction === "left"
        ? "reveal-left"
        : direction === "right"
          ? "reveal-right"
          : direction === "scale"
            ? "reveal-scale"
            : "reveal-fade";

  const revealStyle = {
    "--reveal-duration": `${duration}s`,
    "--reveal-delay": `${delay}s`,
    "--reveal-easing": easing,
    ...style,
  } as CSSProperties;

  return (
    <Tag ref={ref} className={`${dirClass} ${className}`.trim()} style={revealStyle}>
      {children}
    </Tag>
  );
}