import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import portrait from "@/assets/about-portrait.jpg";
import { Counter } from "@/components/site/Counter";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EVIMERO" },
      { name: "description", content: "Meet EVIMERO — independent designer crafting bold brand identities and digital experiences." },
      { property: "og:title", content: "About EVIMERO" },
      { property: "og:description", content: "5+ years building brands, interfaces, and stories with intention." },
    ],
  }),
  component: About,
});

const skills = ["Brand Identity", "Art Direction", "Web Design", "Motion", "Photography", "Strategy", "Typography", "UI/UX"];

function About() {
  return (
    <div className="container mx-auto px-6">
      <section className="pt-12 pb-20">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">[About]</p>
        <h1 className="font-display font-bold text-[clamp(2.8rem,9vw,8rem)] leading-[0.95] uppercase">
          About <span className="text-gold italic">EVIMERO</span>
        </h1>
      </section>

      <section className="grid lg:grid-cols-12 gap-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="lg:col-span-5"
        >
          <div className="relative rounded-3xl overflow-hidden bg-surface aspect-[4/5]">
            <img src={portrait} alt="EVIMERO portrait" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-primary/30 rounded-3xl" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight uppercase mb-6">
            Designer, builder, occasional troublemaker.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-5">
            EVIMERO is an independent creative practice rooted in the belief that great design isn't decoration —
            it's a strategic weapon. Five years deep into building brands, products and digital experiences that
            challenge the default, I work with founders, studios and agencies who'd rather be remembered than safe.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            From identity systems to immersive websites, every engagement is hand-crafted, considered and a little
            obsessive. No templates. No filler. Just work I'd be proud to put my name on.
          </p>

          <div className="mt-10">
            <p className="text-xs uppercase tracking-widest text-foreground/70 mb-4">Expertise</p>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((s) => (
                <span key={s} className="px-4 py-2 rounded-full text-sm border border-primary/40 bg-primary/10 text-gold hover:bg-primary/20 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="border-y border-border py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { n: 5, s: "+", l: "Years Experience" },
          { n: 50, s: "+", l: "Projects Delivered" },
          { n: 20, s: "+", l: "Happy Clients" },
          { n: 12, s: "", l: "Awards" },
        ].map((s) => (
          <div key={s.l}>
            <div className="font-display text-5xl md:text-6xl font-bold text-gold">
              <Counter to={s.n} suffix={s.s} />
            </div>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </section>

      {/* PHILOSOPHY */}
      <section className="py-28 max-w-4xl mx-auto text-center">
        <span className="font-display text-8xl text-gold leading-none">"</span>
        <p className="font-display text-3xl md:text-4xl font-medium leading-snug -mt-4 text-balance">
          Design isn't what it looks like. It's how it makes you feel before you've finished reading the headline.
        </p>
        <p className="mt-6 text-sm uppercase tracking-widest text-gold">— EVIMERO</p>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h3 className="font-display text-4xl md:text-6xl font-bold uppercase">Ready to work together?</h3>
        <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-8 py-4 shadow-gold hover:bg-primary-glow transition-colors">
          Start a Project <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
