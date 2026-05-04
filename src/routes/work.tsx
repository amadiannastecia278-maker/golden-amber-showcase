import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, X, ExternalLink } from "lucide-react";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — EVIMERO" },
      { name: "description", content: "Selected projects: branding, web design, photography and motion by EVIMERO." },
      { property: "og:title", content: "EVIMERO — Selected Work" },
      { property: "og:description", content: "Explore the projects EVIMERO has crafted." },
    ],
  }),
  component: Work,
});

type Project = {
  id: string; title: string; category: string; description: string;
  tools: string | null; external_link: string | null; image_url: string;
};

const fallback: Project[] = [
  { id: "f1", title: "Aureum Identity", category: "Branding", description: "A monochrome identity built around restraint, ritual and a single golden gesture.", tools: "Figma · Illustrator", external_link: null, image_url: work1 },
  { id: "f2", title: "Northbound Studio", category: "Web Design", description: "An editorial portfolio for a New York architecture studio. Slow scroll, big type.", tools: "Framer · Figma", external_link: null, image_url: work2 },
  { id: "f3", title: "Liminal Hours", category: "Photography", description: "Series shot at golden hour. Silhouettes and absence.", tools: "Sony A7IV · Lightroom", external_link: null, image_url: work3 },
  { id: "f4", title: "Kinetic Volume", category: "Motion", description: "A sound-reactive 3D logo system for an underground music label.", tools: "Cinema 4D · Octane", external_link: null, image_url: work4 },
  { id: "f5", title: "Halcyon Brew", category: "Branding", description: "Specialty coffee identity with a poetic, nocturnal edge.", tools: "Illustrator · InDesign", external_link: null, image_url: work1 },
  { id: "f6", title: "Verge Quarterly", category: "Web Design", description: "A digital quarterly for emerging architects. Type-led, image-rich.", tools: "Next.js · Sanity", external_link: null, image_url: work2 },
];

const categories = ["All", "Branding", "Web Design", "Photography", "Motion"];

function Work() {
  const [projects, setProjects] = useState<Project[]>(fallback);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<Project | null>(null);

  useEffect(() => {
    supabase.from("projects").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setProjects(data as Project[]);
      });
  }, []);

  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="container mx-auto px-6">
      <section className="pt-12 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">[Projects]</p>
        <h1 className="font-display font-bold text-[clamp(2.8rem,9vw,8rem)] leading-[0.95] uppercase">
          My <span className="text-gold italic">Work</span>
        </h1>
      </section>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              filter === c
                ? "bg-primary text-primary-foreground shadow-gold"
                : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.button
              layout
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              onClick={() => setOpen(p)}
              className="group text-left relative overflow-hidden rounded-2xl bg-surface aspect-[4/5]"
            >
              <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="text-xs uppercase tracking-widest text-gold mb-2">{p.category}</p>
                <h3 className="font-display text-2xl font-bold mb-3">{p.title}</h3>
                <span className="inline-flex items-center gap-1.5 text-sm text-foreground opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  View Project <ArrowUpRight size={16} />
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full bg-surface rounded-3xl overflow-hidden border border-border my-12"
            >
              <div className="relative">
                <img src={open.image_url} alt={open.title} className="w-full max-h-[60vh] object-cover" />
                <button onClick={() => setOpen(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
                  <X size={18} />
                </button>
              </div>
              <div className="p-8 md:p-10">
                <p className="text-xs uppercase tracking-widest text-gold mb-3">{open.category}</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{open.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{open.description}</p>
                {open.tools && (
                  <p className="mt-6 text-sm"><span className="text-foreground/70">Tools: </span><span className="text-gold">{open.tools}</span></p>
                )}
                {open.external_link && (
                  <a href={open.external_link} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 hover:bg-primary-glow transition-colors">
                    Visit Project <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
