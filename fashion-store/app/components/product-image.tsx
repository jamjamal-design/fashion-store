"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";

type SafeImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  wrapperClassName?: string;
  style?: CSSProperties;
};

export function ProductImage({
  src,
  alt,
  className = "",
  width,
  height,
  fill = false,
  sizes,
  priority,
  wrapperClassName,
  style,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-[rgba(var(--scrim-rgb),0.4)] ${className}`}
        style={fill ? { position: "relative", width: "100%", height: "100%" } : { width, height }}
      >
        <div className="flex flex-col items-center gap-2 text-center text-muted">
          <svg className="h-10 w-10 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-xs">{alt}</span>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={wrapperClassName}>
        {!isLoaded && (
          <div
            className="absolute inset-0 animate-shimmer rounded-[inherit] bg-[rgba(var(--ink-rgb),0.06)]"
            aria-hidden="true"
          />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${className} transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          style={style}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="relative inline-block overflow-hidden">
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-shimmer rounded-[inherit] bg-[rgba(var(--ink-rgb),0.06)]"
          style={{ width: width ?? 560, height: height ?? 560 }}
          aria-hidden="true"
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width ?? 560}
        height={height ?? 560}
        priority={priority}
        className={`${className} transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={style}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
