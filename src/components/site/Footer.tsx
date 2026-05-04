import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Twitter, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-primary/40 bg-[oklch(0.13_0_0)] mt-24">
      <div className="container mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Link to="/" className="font-display text-3xl font-bold text-gold">
            EVIMERO<span className="text-foreground">.</span>
          </Link>
          <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
            Independent creative studio crafting bold brand identities and digital experiences.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-foreground mb-4">Navigate</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">About</Link></li>
            <li><Link to="/work" className="hover:text-gold transition-colors">Work</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-foreground mb-4">Connect</h4>
          <div className="flex gap-3">
            {[Instagram, Linkedin, Twitter, Globe].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-gold transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">hello@evimero.studio</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © 2025 EVIMERO. All Rights Reserved.
      </div>
    </footer>
  );
}
