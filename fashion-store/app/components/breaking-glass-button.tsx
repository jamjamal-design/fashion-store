"use client";

import { useRef, useCallback, useState, type ReactNode, type MouseEvent } from "react";

interface BreakingGlassButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

interface Crack {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
}

interface Shard {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  size: number;
  rotation: number;
}

export function BreakingGlassButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: BreakingGlassButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cracksRef = useRef<Crack[]>([]);
  const shardsRef = useRef<Shard[]>([]);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [showEffect, setShowEffect] = useState(false);

  const generateCracks = useCallback((cx: number, cy: number): Crack[] => {
    const cracks: Crack[] = [];
    const numCracks = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < numCracks; i++) {
      const angle = (Math.PI * 2 * i) / numCracks + (Math.random() - 0.5) * 0.6;
      const length = 20 + Math.random() * 50;
      cracks.push({
        id: i,
        x: cx,
        y: cy,
        angle,
        length,
        width: 1.5 + Math.random() * 1.5,
      });
    }
    for (let i = 0; i < 3; i++) {
      const parentCrack = cracks[Math.floor(Math.random() * cracks.length)];
      cracks.push({
        id: numCracks + i,
        x: parentCrack.x + Math.cos(parentCrack.angle) * parentCrack.length * 0.5,
        y: parentCrack.y + Math.sin(parentCrack.angle) * parentCrack.length * 0.5,
        angle: parentCrack.angle + (Math.random() - 0.5) * Math.PI * 0.6,
        length: 10 + Math.random() * 20,
        width: 0.8 + Math.random() * 0.8,
      });
    }
    return cracks;
  }, []);

  const generateShards = useCallback((cx: number, cy: number): Shard[] => {
    const shards: Shard[] = [];
    const numShards = 20 + Math.floor(Math.random() * 10);

    for (let i = 0; i < numShards; i++) {
      const angle = Math.random() * Math.PI * 2;
      shards.push({
        id: i,
        x: cx,
        y: cy,
        angle,
        velocity: 40 + Math.random() * 120,
        size: 2 + Math.random() * 4,
        rotation: Math.random() * Math.PI * 2,
      });
    }
    return shards;
  }, []);

  const animateEffect = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const duration = 450;

    if (elapsed > duration) {
      setShowEffect(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - easeOut * 0.7})`;
    ctx.shadowColor = "rgba(212, 180, 60, 0.6)";
    ctx.shadowBlur = 4 + (1 - easeOut) * 8;

    cracksRef.current.forEach((crack) => {
      const drawLength = crack.length * (1 - easeOut * 0.3);
      ctx.beginPath();
      ctx.moveTo(crack.x, crack.y);
      const endX = crack.x + Math.cos(crack.angle) * drawLength + (Math.random() - 0.5) * 2;
      const endY = crack.y + Math.sin(crack.angle) * drawLength + (Math.random() - 0.5) * 2;
      ctx.lineTo(endX, endY);
      ctx.lineWidth = crack.width * (1 - easeOut * 0.5);
      ctx.stroke();
    });

    ctx.shadowBlur = 0;

    shardsRef.current.forEach((shard) => {
      const traveled = shard.velocity * easeOut;
      const shardX = shard.x + Math.cos(shard.angle) * traveled;
      const shardY = shard.y + Math.sin(shard.angle) * traveled;
      const shardAlpha = Math.max(0, 1 - easeOut * 1.5);
      const shardSize = shard.size * (1 - easeOut * 0.4);

      ctx.save();
      ctx.translate(shardX, shardY);
      ctx.rotate(shard.rotation + easeOut * Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${shardAlpha * 0.8})`;
      ctx.strokeStyle = `rgba(212, 180, 60, ${shardAlpha * 0.4})`;
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      ctx.moveTo(0, -shardSize);
      ctx.lineTo(shardSize * 0.7, shardSize * 0.5);
      ctx.lineTo(-shardSize * 0.7, shardSize * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    animFrameRef.current = requestAnimationFrame(animateEffect);
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      cracksRef.current = generateCracks(x, y);
      shardsRef.current = generateShards(x, y);
      startTimeRef.current = 0;
      setShowEffect(true);
      animFrameRef.current = requestAnimationFrame(animateEffect);

      setTimeout(() => {
        if (href && typeof href === "string") {
          window.location.href = href;
        }
        onClick?.();
      }, 350);
    },
    [href, onClick, generateCracks, generateShards, animateEffect],
  );

  const commonClasses = `relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold transition-all duration-300 ${className}`;

  if (href) {
    return (
      <a
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={handleClick as (e: MouseEvent<HTMLAnchorElement>) => void}
        className={commonClasses}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        {children}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-10"
          style={{ width: "100%", height: "100%" }}
        />
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={handleClick as (e: MouseEvent<HTMLButtonElement>) => void}
      className={commonClasses}
      disabled={disabled}
    >
      {children}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{ width: "100%", height: "100%" }}
      />
    </button>
  );
}