"use client";

import { useCallback, useState, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";

interface BreakingGlassButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function BreakingGlassButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: BreakingGlassButtonProps) {
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (href && typeof href === "string") {
        e.preventDefault();
      }

      onClick?.();

      if (href && typeof href === "string") {
        window.setTimeout(() => {
          window.location.href = href;
        }, 180);
      }
    },
    [href, onClick],
  );

  const handlePointerDown = useCallback((event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({ x: event.clientX - rect.left, y: event.clientY - rect.top, key: Date.now() });
  }, []);

  const commonClasses = `luxury-button group relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold ${className}`;

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick as (e: MouseEvent<HTMLAnchorElement>) => void}
        onPointerDown={handlePointerDown as (e: MouseEvent<HTMLAnchorElement>) => void}
        className={commonClasses}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        {children}
        <motion.span
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.14),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
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
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick as (e: MouseEvent<HTMLButtonElement>) => void}
      onPointerDown={handlePointerDown as (e: MouseEvent<HTMLButtonElement>) => void}
      className={commonClasses}
      disabled={disabled}
    >
      {children}
      <motion.span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.14),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
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
    </button>
  );
}