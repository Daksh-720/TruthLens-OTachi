import React, { useEffect, useRef } from 'react';

export default function PixelTransition({
  active,
  toDark,
  onComplete = () => {}
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Sharp digital pixel palette
    const colors = toDark
      ? ['#b91c1c', '#dc2626', '#ef4444', '#18181b', '#09090b', '#27272a']
      : ['#f4f3ee', '#ffffff', '#b91c1c', '#dc2626', '#e4e2d8', '#fecdd3'];

    const pixelSize = 14; // Crisp digital pixel size
    const originX = width * 0.88;
    const originY = 36;
    const maxDist = Math.hypot(
      Math.max(originX, width - originX),
      Math.max(originY, height - originY)
    );

    // Build pixel grid
    const pixels = [];
    for (let x = 0; x < width; x += pixelSize) {
      for (let y = 0; y < height; y += pixelSize) {
        const dist = Math.hypot(x - originX, y - originY);
        const delay = (dist / maxDist) * 460; // Deliberate, visible propagation wave
        const color = colors[Math.floor(Math.random() * colors.length)];
        const maxSize = pixelSize - 1; // Crisp square pixel

        pixels.push({
          x,
          y,
          color,
          delay,
          size: 0,
          maxSize,
          growthRate: Math.random() * 0.9 + 0.8,
          shrinkRate: Math.random() * 0.85 + 0.7,
          shimmerRemaining: Math.floor(Math.random() * 12 + 10),
          state: 0 // 0: wait, 1: grow, 2: shimmer, 3: shrink, 4: done
        });
      }
    }

    const startTime = performance.now();
    let completed = false;

    const render = (now) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let allDone = true;

      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];

        if (p.state === 0) {
          if (elapsed >= p.delay) {
            p.state = 1;
          }
          allDone = false;
          continue;
        }

        if (p.state === 1) {
          p.size += p.growthRate;
          if (p.size >= p.maxSize) {
            p.size = p.maxSize;
            p.state = 2;
          }
          allDone = false;
        } else if (p.state === 2) {
          p.shimmerRemaining--;
          // Sharp pixel flicker
          if (p.shimmerRemaining <= 0) {
            p.state = 3;
          }
          allDone = false;
        } else if (p.state === 3) {
          p.size -= p.shrinkRate;
          if (p.size <= 0) {
            p.size = 0;
            p.state = 4;
          } else {
            allDone = false;
          }
        }

        // Draw crisp square pixel
        if (p.size > 0) {
          const offset = (p.maxSize - p.size) * 0.5;
          ctx.fillStyle = p.color;
          ctx.fillRect(
            Math.round(p.x + offset),
            Math.round(p.y + offset),
            Math.round(p.size),
            Math.round(p.size)
          );
        }
      }

      if (!allDone && elapsed < 1600) {
        animRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (!completed) {
          completed = true;
          onComplete();
        }
      }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [active, toDark, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none w-screen h-screen block"
    />
  );
}
