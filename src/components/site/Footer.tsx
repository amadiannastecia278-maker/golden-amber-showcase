import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative grain border-t border-[rgba(192,192,192,0.15)] bg-[#0A0A0A] mt-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px gradient-divider" />
      <div className="container mx-auto px-6 py-16 grid gap-10 md:grid-cols-3 relative">
        <div>
          <Link to="/" className="font-display text-3xl font-bold gradient-silver-text">
            Annastecia
          </Link>
          <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
            Full Stack Web &amp; App Developer crafting scalable digital experiences from Nigeria — for the world.
          </p>
        </div>
        <div>
          <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground mb-4">Navigate</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-silver transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-silver transition-colors">About</Link></li>
            <li><Link to="/work" className="hover:text-silver transition-colors">Work</Link></li>
            <li><Link to="/shop" className="hover:text-silver transition-colors">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-silver transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground mb-4">Connect</h4>
          <div className="flex gap-3">
            {[
              { I: Github, href: "https://github.com" },
              { I: Linkedin, href: "https://linkedin.com" },
              { I: Twitter, href: "https://twitter.com" },
              { I: Globe, href: "https://behance.net" },
            ].map(({ I, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full border border-[rgba(192,192,192,0.2)] flex items-center justify-center hover:border-silver hover:text-silver transition-all hover:-translate-y-0.5">
                <I size={16} />
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">amzybaby125@gmail.com</p>
        </div>
      </div>
      <div className="border-t border-[rgba(192,192,192,0.1)] py-6 text-center text-xs text-muted-foreground">
        © 2025 Amadi Annastecia Amarachi. All Rights Reserved.
      </div>
    </footer>
  );
}
