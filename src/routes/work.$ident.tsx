import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getProjectByIdent } from "@/server/projects.functions";

export const Route = createFileRoute("/work/$ident")({
  loader: async ({ params }) => {
    const { project } = await getProjectByIdent({ data: { ident: params.ident } });
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project — EVIMERO" }] };
    const title = `${p.title} — ${p.category} | EVIMERO`;
    const desc = (p.description ?? "").slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:image", content: p.image_url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: p.image_url },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container mx-auto px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">[404]</p>
      <h1 className="font-display text-5xl font-bold uppercase mb-6">Project not found</h1>
      <Link to="/work" className="inline-flex items-center gap-2 text-gold hover:underline">
        <ArrowLeft size={16} /> Back to all projects
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-6 py-32 text-center">
      <h1 className="font-display text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  return (
    <article className="container mx-auto px-6 pb-24">
      <Link to="/work" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mt-4 mb-10">
        <ArrowLeft size={14} /> All projects
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="max-w-4xl mb-12"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">{project.category}</p>
        <h1 className="font-display font-bold text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] uppercase">
          {project.title}
        </h1>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
        className="rounded-3xl overflow-hidden bg-surface mb-12"
      >
        <img src={project.image_url} alt={project.title} className="w-full h-auto object-cover max-h-[80vh]" />
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <p className="text-xs uppercase tracking-widest text-gold mb-3">Overview</p>
          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>
        <aside className="lg:col-span-4 space-y-6">
          {project.tools && (
            <div className="bg-surface/60 border border-border rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tools</p>
              <p className="text-gold font-medium">{project.tools}</p>
            </div>
          )}
          {project.external_link && (
            <a href={project.external_link} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 hover:bg-primary-glow transition-colors shadow-gold">
              Visit Project <ExternalLink size={16} />
            </a>
          )}
        </aside>
      </div>
    </article>
  );
}