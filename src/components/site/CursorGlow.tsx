import { useEffect, useState } from "react";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-100"
      style={{
        left: pos.x,
        top: pos.y,
        width: 24,
        height: 24,
        background: "radial-gradient(circle, oklch(0.85 0.16 85 / 0.85) 0%, oklch(0.78 0.14 80 / 0) 70%)",
        boxShadow: "0 0 40px oklch(0.78 0.14 80 / 0.6)",
      }}
    />
  );
}
