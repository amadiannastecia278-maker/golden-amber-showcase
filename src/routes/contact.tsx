import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, ChevronDown, Github, Linkedin, Twitter, Globe } from "lucide-react";
import { ContactForm } from "@/components/site/ContactForm";
import { Orbs } from "@/components/site/Orbs";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Amadi Annastecia Amarachi" },
      { name: "description", content: "Start a project with Annastecia. Email, social, or send a message directly." },
      { property: "og:title", content: "Contact Annastecia" },
      { property: "og:description", content: "Let's build something remarkable." },
    ],
  }),
  component: Contact,
});

const faqs = [
  { q: "How long does a project take?", a: "Marketing sites: 2–4 weeks. Web apps: 6–12 weeks. Mobile apps: 8–16 weeks. Faster turnarounds available with rush pricing." },
  { q: "Do you work with international clients?", a: "Yes — I work with clients globally, with most communication async via email, Slack, or Linear." },
  { q: "What technologies do you specialise in?", a: "React, Next.js, TypeScript, Node.js, PostgreSQL, Supabase, Flutter, and React Native." },
  { q: "Do you offer maintenance after delivery?", a: "Absolutely. I offer monthly retainers for clients who want ongoing development, monitoring, and feature work." },
  { q: "How do I get started?", a: "Send a message through the form below — include your timeline, budget range, and a quick description of the project." },
];

function Contact() {
  return (
    <div className="container mx-auto px-6 relative">
      <Orbs />

      <section className="pt-12 pb-12 relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-4">[Contact]</p>
        <h1 className="font-display font-bold text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.98] gradient-silver-text text-balance">
          Let's <em className="italic">build</em> something.
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground text-lg">
          Tell me about your project, your timeline, your wildest reference. I respond within 24 hours.
        </p>
      </section>

      <section className="grid lg:grid-cols-12 gap-10 pb-24 relative">
        <aside className="lg:col-span-5 flex flex-col gap-5 order-2 lg:order-1">
          <InfoCard icon={<Mail size={18} />} label="Email" value="amzybaby125@gmail.com" />
          <InfoCard icon={<MapPin size={18} />} label="Based in" value="Nigeria · Worldwide" />
          <div className="border-gradient rounded-2xl p-6 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <p className="text-sm">Currently <span className="text-silver font-medium">available</span> for freelance projects</p>
          </div>
          <div className="border-gradient rounded-2xl p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Find me on</p>
            <div className="flex gap-3">
              {[Github, Linkedin, Twitter, Globe].map((Icon, i) => (
                <a key={i} href="#" target="_blank" rel="noreferrer"
                  className="w-11 h-11 rounded-full border border-[rgba(192,192,192,0.2)] flex items-center justify-center hover:border-silver hover:text-silver transition-all hover:-translate-y-0.5">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </aside>
        <div className="lg:col-span-7 border-gradient rounded-3xl p-6 md:p-10 order-1 lg:order-2">
          <ContactForm variant="full" source="contact" />
        </div>
      </section>

      <section className="pb-32">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver mb-3">[FAQ]</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-silver-text">Common questions</h2>
        </div>
        <div className="max-w-3xl mx-auto divide-y divide-[rgba(192,192,192,0.15)] border-y border-[rgba(192,192,192,0.15)]">
          {faqs.map((f, i) => <FaqItem key={i} {...f} />)}
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border-gradient rounded-2xl p-6 flex items-center gap-4">
      <div className="w-11 h-11 rounded-full gradient-button text-black flex items-center justify-center">{icon}</div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
        <p className="font-sans text-base md:text-lg font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="w-full text-left py-6 group">
      <div className="flex items-center justify-between gap-6">
        <h4 className="font-sans text-lg md:text-xl font-semibold group-hover:text-silver transition-colors">{q}</h4>
        <ChevronDown size={20} className={`text-silver shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}>
        <p className="overflow-hidden text-muted-foreground leading-relaxed">{a}</p>
      </div>
    </button>
  );
}
