import React, { useEffect, useRef } from 'react';

export default function PixelTransition({
  active,
  toDark,
  origin = { x: null, y: null },
  onThemeSwap = () => {},
  onComplete = () => {}
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const onThemeSwapRef = useRef(onThemeSwap);

  // Keep callback refs updated so parent re-renders don't cancel animations
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onThemeSwapRef.current = onThemeSwap;
  });

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Dynamic brand color palette
    const colors = toDark
      ? ['#b91c1c', '#dc2626', '#ef4444', '#18181b', '#09090b', '#27272a', '#1a1a19']
      : ['#b91c1c', '#dc2626', '#ef4444', '#faf8f4', '#eeebe2', '#ebe7dc', '#ffffff'];

    // Optimal pixel sizing: chunkier, crisp pixels that perform at solid 60/120 FPS
    const pixelSize = Math.max(20, Math.round(Math.min(width, height) / 44));
    const originX = origin?.x != null && origin.x > 0 ? origin.x : width * 0.88;
    const originY = origin?.y != null && origin.y > 0 ? origin.y : 36;

    const maxDist = Math.hypot(
      Math.max(originX, width - originX),
      Math.max(originY, height - originY)
    );

    // Group pixels by color index to batch ctx.fillStyle calls (100x canvas draw performance)
    const colorBuckets = colors.map(() => []);

    const growDuration = 120;
    const shimmerDuration = 80;
    const shrinkDuration = 120;
    const totalPixelDuration = growDuration + shimmerDuration + shrinkDuration;
    const waveDelayDuration = 320;

    for (let x = 0; x < width; x += pixelSize) {
      for (let y = 0; y < height; y += pixelSize) {
        const dist = Math.hypot(x + pixelSize * 0.5 - originX, y + pixelSize * 0.5 - originY);
        const delay = (dist / maxDist) * waveDelayDuration;
        const colorIdx = Math.floor(Math.random() * colors.length);
        const maxSize = pixelSize - 1; // 1px spacing for digital grid matrix look

        colorBuckets[colorIdx].push({
          x,
          y,
          delay,
          endTime: delay + totalPixelDuration,
          maxSize
        });
      }
    }

    const startTime = performance.now();
    let hasSwappedTheme = false;
    let isFinished = false;

    const render = (now) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      // Trigger theme swap at the peak wave wavefront
      if (!hasSwappedTheme && elapsed >= 260) {
        hasSwappedTheme = true;
        if (onThemeSwapRef.current) {
          onThemeSwapRef.current();
        }
      }

      let stillAnimating = false;

      for (let c = 0; c < colors.length; c++) {
        const bucket = colorBuckets[c];
        ctx.fillStyle = colors[c];

        for (let i = 0; i < bucket.length; i++) {
          const p = bucket[i];

          if (elapsed < p.delay) {
            stillAnimating = true;
            continue;
          }

          if (elapsed >= p.endTime) {
            continue;
          }

          stillAnimating = true;
          const localElapsed = elapsed - p.delay;
          let currentSize = 0;

          if (localElapsed < growDuration) {
            // Growing stage
            currentSize = p.maxSize * (localElapsed / growDuration);
          } else if (localElapsed < growDuration + shimmerDuration) {
            // Peak / shimmer stage
            currentSize = p.maxSize;
          } else {
            // Shrinking stage
            const shrinkElapsed = localElapsed - growDuration - shimmerDuration;
            currentSize = p.maxSize * (1 - shrinkElapsed / shrinkDuration);
          }

          if (currentSize > 0.5) {
            const offset = (p.maxSize - currentSize) * 0.5;
            ctx.fillRect(
              Math.round(p.x + offset),
              Math.round(p.y + offset),
              Math.round(currentSize),
              Math.round(currentSize)
            );
          }
        }
      }

      if (stillAnimating && elapsed < 1000) {
        animRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (!isFinished) {
          isFinished = true;
          if (!hasSwappedTheme && onThemeSwapRef.current) {
            onThemeSwapRef.current();
          }
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
      }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [active, toDark, origin.x, origin.y]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 z-50 pointer-events-none w-screen h-screen ${
        active ? 'block' : 'hidden'
      }`}
    />
  );
}
