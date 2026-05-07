import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="font-sans text-xl font-bold tracking-tight gradient-silver-text">
          Annastecia<span className="text-silver">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className="group relative text-xs uppercase tracking-[0.2em] font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {l.label}
                <span className={`pointer-events-none absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-500 gradient-divider ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            );
          })}
        </nav>

        <Link
          to="/contact"
          className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest text-black gradient-button hover:shadow-glow transition-shadow"
        >
          Hire Me
        </Link>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-foreground p-2"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center gap-7 animate-in fade-in">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${i * 60}ms` }}
              className="font-display text-4xl font-bold gradient-silver-text animate-in fade-in slide-in-from-bottom-4"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 px-8 py-3 rounded-full gradient-button text-black font-semibold uppercase tracking-widest text-xs"
          >
            Hire Me
          </Link>
        </div>
      )}
    </header>
  );
}
