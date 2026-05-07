import { useEffect, useState } from "react";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [ghost, setGhost] = useState({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const tick = () => {
      setGhost((g) => ({ x: g.x + (pos.x - g.x) * 0.15, y: g.y + (pos.y - g.y) * 0.15 }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pos, enabled]);

  if (!enabled) return null;
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ left: pos.x, top: pos.y, width: 6, height: 6 }} />
      <div aria-hidden className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(192,192,192,0.5)]"
        style={{ left: ghost.x, top: ghost.y, width: 36, height: 36 }} />
    </>
  );
}
