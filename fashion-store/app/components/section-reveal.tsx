"use client";

import { ScrollReveal, type RevealDirection } from "./scroll-reveal";
import type { ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  /** Each section animates in with a smooth float-up. Badges come first,
   *  then headings, then content. Defaults are set to feel luxurious. */
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
}

/**
 * Thin wrapper that renders a <ScrollReveal as="section"> so we can
 * wrap server-side sections on the homepage without creating a client
 * boundary with "use client" in the page itself.
 */
export function SectionReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.7,
}: SectionRevealProps) {
  return (
    <ScrollReveal
      as="section"
      direction={direction}
      delay={delay}
      duration={duration}
      className={className}
      threshold={0.08}
    >
      {children}
    </ScrollReveal>
  );
}