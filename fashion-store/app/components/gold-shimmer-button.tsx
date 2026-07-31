"use client";

import { type ReactNode, type MouseEvent } from "react";
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
  const handleClick = (_e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (href && typeof href === "string") {
      return;
    }
    onClick?.();
  };

  const commonClasses = `relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold transition-all duration-300 ${className}`;

  const shimmerContent = (
    <>
      {/* Shimmer overlay */}
      <motion.span
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212, 180, 60, 0.15) 40%, rgba(212, 180, 60, 0.25) 50%, rgba(212, 180, 60, 0.15) 60%, transparent 100%)",
          width: "60%",
        }}
      />
      {/* Glow effect on hover */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(212, 180, 60, 0.2), transparent 70%)",
        }}
      />
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick as (e: MouseEvent<HTMLAnchorElement>) => void}
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
      className={`group ${commonClasses}`}
      disabled={disabled}
    >
      {shimmerContent}
    </button>
  );
}