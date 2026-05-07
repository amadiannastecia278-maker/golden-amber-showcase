import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Download, ExternalLink } from "lucide-react";
import { Orbs } from "@/components/site/Orbs";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Templates by Annastecia" },
      { name: "description", content: "Premium digital templates and resources by Annastecia. Production-ready and fully customisable." },
      { property: "og:title", content: "Templates by Annastecia" },
      { property: "og:description", content: "Download premium templates — free and paid." },
    ],
  }),
  component: Shop,
});

type Template = {
  id: string; title: string; description: string; price: number; currency: string;
  preview_image_url: string; file_url: string | null; payment_link: string | null;
  is_free: boolean; category: string;
};

function Shop() {
  const [items, setItems] = useState<Template[] | null>(null);

  useEffect(() => {
    supabase.from("templates").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Template[]) ?? []));
  }, []);

  const onClick = async (t: Template) => {
    // Log the event silently
    supabase.from("contact_submissions").insert({
      full_name: "Template Visitor", email: "anonymous@shop.local",
      subject: `Template ${t.is_free ? "download" : "purchase click"}: ${t.title}`,
      message: `Visitor accessed "${t.title}" (${t.is_free ? "free" : `paid ${t.currency} ${t.price}`}).`,
      source: "shop",
    }).then(() => {});
    if (t.is_free && t.file_url) window.open(t.file_url, "_blank", "noopener");
    else if (t.payment_link) window.open(t.payment_link, "_blank", "noopener");
  };

  return (
    <div className="container mx-auto px-6 relative">
      <Orbs />
      <section className="pt-12 pb-12 relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-4">[Shop]</p>
        <h1 className="font-display font-bold text-[clamp(2.6rem,9vw,7rem)] leading-[0.98] gradient-silver-text">
          Digital <em className="italic">Templates</em>.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground text-lg">
          Premium templates built by Annastecia — production-ready, clean, and fully customisable.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {items === null ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="rounded-2xl aspect-[4/5] skeleton" />)
          : items.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-20">No templates published yet — check back soon.</p>
          ) : items.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
              className="border-gradient rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#111]">
                <img src={t.preview_image_url} alt={t.title} loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display text-xl font-bold">{t.title}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-silver text-silver shrink-0">
                    {t.is_free ? "Free" : "Premium"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{t.description}</p>
                <div className="flex items-center justify-between mt-5">
                  <span className="font-mono text-silver">
                    {t.is_free ? "Free" : `${t.currency} ${Number(t.price).toLocaleString()}`}
                  </span>
                  <button onClick={() => onClick(t)} className="inline-flex items-center gap-2 rounded-full gradient-button text-black font-semibold text-sm px-4 py-2 shadow-silver hover:shadow-glow transition-shadow">
                    {t.is_free ? "Download" : "Get Template"}
                    {t.is_free ? <Download size={14} /> : <ExternalLink size={14} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
      </section>
    </div>
  );
}
