import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import portrait from "@/assets/annastecia-portrait.jpg";
import { Counter } from "@/components/site/Counter";
import { Orbs } from "@/components/site/Orbs";
import { ArrowRight, Code2, Smartphone, Server, Palette } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Amadi Annastecia Amarachi" },
      { name: "description", content: "Full Stack Web & App Developer based in Nigeria. 3+ years building scalable digital products." },
      { property: "og:title", content: "About Annastecia" },
      { property: "og:description", content: "Designer, builder, full stack engineer." },
    ],
  }),
  component: About,
});

const services = [
  { I: Code2, title: "Web Development", body: "React, Next.js and TypeScript stacks built to last." },
  { I: Smartphone, title: "App Development", body: "Cross-platform mobile apps with Flutter and React Native." },
  { I: Server, title: "Backend & APIs", body: "Node.js, PostgreSQL, Supabase — robust and scalable." },
  { I: Palette, title: "UI/UX Implementation", body: "Pixel-precise interfaces from Figma to production." },
];

const skills = {
  Frontend: [["React / Next.js", 95], ["TypeScript", 90], ["TailwindCSS", 95], ["Framer Motion", 80]],
  Backend: [["Node.js / Express", 88], ["PostgreSQL", 85], ["Supabase / Firebase", 90], ["GraphQL / REST", 82]],
  Mobile: [["Flutter / Dart", 85], ["React Native", 80]],
  "Tools & Platforms": [["Git / GitHub", 95], ["Figma", 88], ["Vercel / Cloud", 85]],
};

const timeline = [
  { y: "2022", t: "Started building", b: "First freelance projects: landing pages and small business sites." },
  { y: "2023", t: "Full stack pivot", b: "Shipped first production React + Node platform; deepened TypeScript." },
  { y: "2024", t: "Mobile expansion", b: "Built and launched cross-platform apps in Flutter for Nigerian clients." },
  { y: "2025", t: "Studio operations", b: "Now serving global clients with end-to-end product delivery." },
];

function Bar({ label, val }: { label: string; val: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-2"><span className="text-foreground">{label}</span><span className="text-silver font-mono">{val}%</span></div>
      <div className="h-1.5 rounded-full bg-[#1A1A1A] overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${val}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full gradient-button" />
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="container mx-auto px-6 relative">
      <Orbs />
      <section className="pt-12 pb-16 relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-4">[About]</p>
        <h1 className="font-display font-bold text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.98] gradient-silver-text">
          About <em className="italic">me</em>
        </h1>
      </section>

      <section className="grid lg:grid-cols-12 gap-12 pb-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="lg:col-span-5"
        >
          <div className="border-gradient relative rounded-3xl overflow-hidden aspect-[4/5] animate-float">
            <img src={portrait} alt="Amadi Annastecia Amarachi" loading="lazy" width={896} height={1152}
              className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-3">Amadi Annastecia Amarachi</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-silver-text mb-6">
            Full Stack Web &amp; App Developer.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-5">
            I'm a Nigeria-based full stack engineer focused on building production-grade web and mobile platforms.
            Three years in, I've shipped over forty projects — from polished marketing sites to multi-tenant SaaS dashboards.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            I work with founders and teams who care about craft. No throwaway code. No half-considered interfaces.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {services.map(({ I, title, body }) => (
              <div key={title} className="border-gradient rounded-2xl p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full gradient-button text-black flex items-center justify-center shrink-0"><I size={18} /></div>
                <div>
                  <p className="font-sans font-semibold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/contact" className="mt-10 inline-flex items-center gap-2 rounded-full gradient-button text-black font-semibold px-7 py-3.5 shadow-silver hover:shadow-glow transition-shadow">
            Let's Work Together <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* SKILLS */}
      <section className="border-y border-[rgba(192,192,192,0.15)] py-16">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-3">Skills</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-silver-text">What I do well</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl mx-auto">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group}>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-5">{group}</p>
              <div className="space-y-5">
                {items.map(([l, v]) => <Bar key={l as string} label={l as string} val={v as number} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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

      {/* TIMELINE */}
      <section className="py-20">
        <div className="text-center mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-3">Journey</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-silver-text">Milestones</h2>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px gradient-divider" />
          <div className="space-y-12">
            {timeline.map((t, i) => (
              <motion.div key={t.y}
                initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-10 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div className={`absolute left-2.5 md:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-silver shadow-glow`} />
                <div className={`${i % 2 ? "md:text-left md:pl-8" : "md:text-right md:pr-8"}`}>
                  <p className="font-mono text-silver text-sm">{t.y}</p>
                  <h4 className="font-display text-2xl font-bold mt-1">{t.t}</h4>
                  <p className="text-muted-foreground mt-2">{t.b}</p>
                </div>
                <div />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-28 max-w-4xl mx-auto text-center">
        <span className="font-display text-8xl gradient-silver-text leading-none">"</span>
        <p className="font-display italic text-3xl md:text-4xl font-medium leading-snug -mt-4 text-balance">
          I don't just write code — I craft systems that scale, breathe, and outlive their first version.
        </p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-silver">— Annastecia</p>
      </section>
    </div>
  );
}
