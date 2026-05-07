import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Amadi Annastecia Amarachi" },
      { name: "description", content: "Selected web, mobile, and full stack projects by Annastecia." },
      { property: "og:title", content: "Annastecia — Selected Work" },
      { property: "og:description", content: "Projects across web apps, mobile, UI/UX and backend." },
    ],
  }),
  component: Work,
});

type Project = {
  id: string; title: string; category: string; description: string;
  tools: string | null; external_link: string | null; image_url: string;
  slug?: string | null;
};

const categories = ["All", "Web Apps", "Mobile Apps", "UI/UX", "Open Source", "Backend"];

function Work() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    supabase.from("projects").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => setProjects((data as Project[]) ?? []));
  }, []);

  const visible = !projects ? null : filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="container mx-auto px-6">
      <section className="pt-12 pb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-4">[Projects]</p>
        <h1 className="font-display font-bold text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.98] gradient-silver-text">
          My <em className="italic">Work</em>
        </h1>
      </section>

      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all ${
              filter === c
                ? "gradient-button text-black shadow-silver"
                : "border border-[rgba(192,192,192,0.25)] text-muted-foreground hover:border-silver hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {visible === null ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl aspect-[4/5] skeleton" />
          ))
        ) : visible.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-20">No projects to show yet.</p>
        ) : (
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                layout key={p.id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="border-gradient group relative overflow-hidden rounded-2xl aspect-[4/5]"
              >
                <Link to="/work/$ident" params={{ ident: p.slug || p.id }} className="absolute inset-0 block">
                  <img src={p.image_url} alt={p.title} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(135deg, transparent 30%, rgba(192,192,192,0.18), transparent 70%)" }} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-silver mb-2">{p.category}</p>
                    <h3 className="font-display text-2xl font-bold mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                    {p.tools && <p className="font-mono text-[10px] text-muted-foreground/80">{p.tools}</p>}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-silver opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                      View Details <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
