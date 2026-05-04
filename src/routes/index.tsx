import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import { ContactForm } from "@/components/site/ContactForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EVIMERO | Creative Portfolio" },
      { name: "description", content: "Bold design, branding, and digital experiences crafted by EVIMERO." },
    ],
  }),
  component: Home,
});

const featured = [
  { img: work1, title: "Aureum Identity", category: "Branding" },
  { img: work2, title: "Northbound Studio", category: "Web Design" },
  { img: work3, title: "Liminal Hours", category: "Photography" },
  { img: work4, title: "Kinetic Volume", category: "Motion" },
];

const heroLine = "WE CREATE. WE BUILD. WE DELIVER.".split(" ");

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden -mt-20 pt-20">
        <div className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          <div className="absolute inset-0 gradient-radial opacity-60" />
        </div>

        <div className="container mx-auto px-6 py-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-gold mb-8"
          >
            ▸ Creative Studio · Est. 2020
          </motion.p>

          <h1 className="font-display font-bold text-[clamp(2.8rem,9vw,8.5rem)] leading-[0.95] uppercase text-balance">
            {heroLine.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block mr-4 ${i === 1 ? "text-gold italic font-display" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 max-w-xl text-lg text-muted-foreground leading-relaxed"
          >
            EVIMERO is an independent creative practice — building brands, interfaces and stories
            that refuse to blend in. Crafted with intent. Delivered with edge.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to="/work" className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-7 py-4 shadow-gold animate-glow hover:bg-primary-glow transition-colors">
              View My Work
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full border border-border hover:border-primary text-foreground font-semibold px-7 py-4 transition-colors">
              Get In Touch
              <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45 group-hover:text-gold" />
            </Link>
          </motion.div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-muted-foreground hidden md:block">
          ↓ Scroll to explore
        </div>
      </section>

      {/* INTRO */}
      <section className="container mx-auto px-6 py-28">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <p className="md:col-span-3 text-xs uppercase tracking-[0.3em] text-gold">[01] — Intro</p>
          <h2 className="md:col-span-9 font-display text-4xl md:text-6xl font-bold leading-tight text-balance">
            A studio of one, with the appetite of a&nbsp;
            <span className="text-gold">collective</span>. Building brands that move, scale and resonate.
          </h2>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="container mx-auto px-6 pb-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">[02] — Featured</p>
            <h3 className="font-display text-4xl md:text-5xl font-bold uppercase">Selected Works</h3>
          </div>
          <Link to="/work" className="hidden md:inline-flex items-center gap-2 text-sm text-foreground hover:text-gold transition-colors">
            All Projects <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl bg-surface aspect-[4/3]"
            >
              <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold mb-2">{p.category}</p>
                  <h4 className="font-display text-2xl font-bold">{p.title}</h4>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="container mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">[03] — Contact</p>
            <h3 className="font-display text-5xl md:text-6xl font-bold leading-tight uppercase">
              Have an idea? <span className="text-gold">Let's make it real.</span>
            </h3>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
              Drop a line below. Whether it's a fully-formed brief or a 3am scribble, I read every message myself.
            </p>
          </div>
          <div className="lg:col-span-7 bg-surface/60 border border-border rounded-3xl p-8 md:p-10">
            <ContactForm source="home" />
          </div>
        </div>
      </section>
    </div>
  );
}
