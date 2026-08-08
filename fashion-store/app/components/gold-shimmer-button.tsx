"use client";

import { type ReactNode, type MouseEvent, useState } from "react";
import { motion } from "framer-motion";

interface GoldShimmerButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function GoldShimmerButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: GoldShimmerButtonProps) {
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

  const handleClick = (_e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (href && typeof href === "string") {
      return;
    }
    onClick?.();
  };

  const handlePointerDown = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({ x: event.clientX - rect.left, y: event.clientY - rect.top, key: Date.now() });
  };

  const commonClasses = `luxury-button group relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold ${className}`;

  const shimmerContent = (
    <>
      {/* Shimmer overlay */}
      <motion.span
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{
          repeat: Infinity,
          duration: 3.6,
          ease: "easeInOut",
          repeatDelay: 2,
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.04) 42%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 255, 255, 0.04) 58%, transparent 100%)",
          width: "60%",
        }}
      />
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.18), transparent 72%)",
        }}
      />
      {ripple && (
        <motion.span
          key={ripple.key}
          className="pointer-events-none absolute rounded-full bg-[rgba(255,255,255,0.24)]"
          initial={{ opacity: 0.35, scale: 0 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ left: ripple.x - 12, top: ripple.y - 12, width: 24, height: 24 }}
        />
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick as (e: MouseEvent<HTMLAnchorElement>) => void}
        onPointerDown={handlePointerDown as (e: MouseEvent<HTMLAnchorElement>) => void}
        className={`group ${commonClasses}`}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        {shimmerContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick as (e: MouseEvent<HTMLButtonElement>) => void}
      onPointerDown={handlePointerDown as (e: MouseEvent<HTMLButtonElement>) => void}
      className={`group ${commonClasses}`}
      disabled={disabled}
    >
      {shimmerContent}
    </button>
  );
}