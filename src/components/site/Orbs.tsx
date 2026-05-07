export function Orbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, rgba(192,192,192,0.07), transparent 70%)" }} />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-3xl animate-float-2"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)" }} />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, rgba(192,192,192,0.06), transparent 70%)", animationDelay: "4s" }} />
    </div>
  );
}
