import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { ContactForm } from "@/components/site/ContactForm";
import { Orbs } from "@/components/site/Orbs";
import { Spotlight } from "@/components/site/Spotlight";
import { Counter } from "@/components/site/Counter";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amadi Annastecia Amarachi | Full Stack Developer" },
      { name: "description", content: "Full Stack Web & App Developer crafting scalable digital experiences. Available for freelance projects." },
      { property: "og:title", content: "Amadi Annastecia Amarachi | Full Stack Developer" },
      { property: "og:description", content: "Full Stack Web & App Developer crafting scalable digital experiences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const heroWords = "I architect digital experiences.".split(" ");
const tagline = "Full Stack Web & App Developer";
const stack = ["React", "Next.js", "Node.js", "Flutter", "TypeScript", "PostgreSQL", "Firebase", "Supabase", "TailwindCSS", "React Native", "GraphQL", "Figma"];
const ticker = "Full Stack Developer · React · Next.js · Flutter · Node.js · Firebase · PostgreSQL · UI/UX · API Integration · Mobile Apps · ";

function Typewriter({ text }: { text: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= text.length) return;
    const id = setTimeout(() => setI(i + 1), 38);
    return () => clearTimeout(id);
  }, [i, text]);
  return (
    <span className="font-mono text-silver tracking-widest">
      {text.slice(0, i)}
      <span className="inline-block w-[2px] h-[1em] align-middle bg-silver ml-1 animate-pulse" />
    </span>
  );
}

type Project = { id: string; title: string; category: string; description: string; image_url: string; slug: string | null; tools: string | null };

function Home() {
  const [featured, setFeatured] = useState<Project[]>([]);
  useEffect(() => {
    supabase.from("projects").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setFeatured(data as Project[]); });
  }, []);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center grain -mt-20 pt-20">
        <div className="absolute inset-0 -z-10 gradient-radial" />
        <div className="absolute inset-0 -z-10 opacity-30">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        </div>
        <Orbs />
        <Spotlight />

        <div className="container mx-auto px-6 py-24 relative">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-6"
          >
            ▸ Full Stack Engineer · Available for hire
          </motion.p>

          <h1 className="font-display font-bold text-[clamp(2.6rem,8vw,7rem)] leading-[1.02] text-balance gradient-silver-text">
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-3"
              >
                {word === "experiences." ? <em className="italic font-display">{word}</em> : word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-8 text-sm md:text-base min-h-[1.5rem]"
          >
            <Typewriter text={tagline} />
          </motion.p>

          <div className="mt-6 h-px w-40 bg-silver origin-left animate-draw" />

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-8 max-w-xl text-base text-muted-foreground leading-relaxed"
          >
            I build at the intersection of logic and beauty — scalable web platforms, mobile apps, and elegant systems that outlive their first version.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to="/work" className="group inline-flex items-center gap-2 rounded-full gradient-button text-black font-semibold px-7 py-3.5 shadow-silver hover:shadow-glow transition-shadow">
              View My Work
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#" className="group inline-flex items-center gap-2 rounded-full border border-[rgba(192,192,192,0.4)] hover:border-silver text-foreground font-semibold px-7 py-3.5 transition-all hover:bg-white/5">
              Download CV
              <Download size={16} />
            </a>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hidden md:block">
            ↓ Scroll
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-[rgba(192,192,192,0.15)] py-5 bg-[#0A0A0A] overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap font-mono text-sm text-silver">
          <span>{ticker.repeat(3)}</span>
          <span>{ticker.repeat(3)}</span>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="container mx-auto px-6 py-28 relative">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-3">[01] — Selected Work</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold gradient-silver-text">Recent Projects</h2>
          </div>
          <Link to="/work" className="inline-flex items-center gap-2 text-sm text-foreground hover:text-silver transition-colors">
            All Projects <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(featured.length ? featured : Array.from({ length: 3 })).map((p: any, i: number) => (
            <motion.div
              key={p?.id ?? i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="border-gradient group relative overflow-hidden rounded-2xl aspect-[4/5]"
            >
              {p ? (
                <Link to="/work/$ident" params={{ ident: p.slug || p.id }} className="absolute inset-0 block">
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(135deg, transparent 30%, rgba(192,192,192,0.15), transparent 70%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-silver mb-2">{p.category}</p>
                    <h3 className="font-display text-2xl font-bold">{p.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-silver opacity-0 group-hover:opacity-100 transition-opacity">
                      View Project <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="absolute inset-0 skeleton" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* STACK */}
      <section className="container mx-auto px-6 py-20 relative">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-3">[02] — My Stack</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-silver-text">Tools of the trade</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {stack.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="border-gradient rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-silver hover:text-white hover:-translate-y-0.5 transition-transform"
            >
              {s}
            </motion.span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[rgba(192,192,192,0.15)] py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center container mx-auto px-6">
        {[
          { n: 3, s: "+", l: "Years Experience" },
          { n: 40, s: "+", l: "Projects Delivered" },
          { n: 15, s: "+", l: "Happy Clients" },
          { n: 5, s: "+", l: "Open Source" },
        ].map((s) => (
          <div key={s.l}>
            <div className="font-display text-5xl md:text-6xl font-bold gradient-silver-text">
              <Counter to={s.n} suffix={s.s} />
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </section>

      {/* CONTACT */}
      <section className="container mx-auto px-6 py-28 relative">
        <Orbs />
        <div className="grid lg:grid-cols-12 gap-12 relative">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-4">[03] — Contact</p>
            <h3 className="font-display text-4xl md:text-6xl font-bold gradient-silver-text leading-tight">
              Start a <em className="italic">conversation</em>.
            </h3>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
              Have a project in mind? I read every message myself and respond within 24 hours.
            </p>
          </div>
          <div className="lg:col-span-7 border-gradient rounded-3xl p-8 md:p-10">
            <ContactForm source="home" />
          </div>
        </div>
      </section>
    </div>
  );
}
