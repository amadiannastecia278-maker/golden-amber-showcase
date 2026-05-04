import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, ChevronDown, Instagram, Linkedin, Twitter } from "lucide-react";
import { ContactForm } from "@/components/site/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — EVIMERO" },
      { name: "description", content: "Start a project with EVIMERO. Email, social, or send a message directly." },
      { property: "og:title", content: "Contact EVIMERO" },
      { property: "og:description", content: "Let's build something memorable." },
    ],
  }),
  component: Contact,
});

const faqs = [
  { q: "What kind of projects do you take on?", a: "Brand identity systems, websites, art direction and motion. I love long-form partnerships but also one-shot launches." },
  { q: "How long does a typical project take?", a: "Brands run 4–8 weeks, websites 6–10 weeks. Rush turnarounds available with a small surcharge." },
  { q: "Do you work with startups?", a: "Often. If your story is sharp and your timeline is realistic, budget is rarely the blocker." },
  { q: "What's your process?", a: "Discover → Direction → Design → Deliver. Tight loops, clear milestones, no agency theatre." },
  { q: "Do you offer ongoing support?", a: "Yes — retainers from 10h/month for design partners who want a creative arm on call." },
];

function Contact() {
  return (
    <div className="container mx-auto px-6 relative overflow-hidden">
      {/* floating glow */}
      <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl animate-float pointer-events-none" />
      <div className="absolute top-[40%] -left-40 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />

      <section className="pt-12 pb-12 relative">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">[Contact]</p>
        <h1 className="font-display font-bold text-[clamp(2.8rem,9vw,8rem)] leading-[0.95] uppercase text-balance">
          Let's <span className="text-gold italic">build</span> something.
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground text-lg">
          Tell me about your project, your timeline, your wildest reference. I'll respond within 24 hours.
        </p>
      </section>

      <section className="grid lg:grid-cols-12 gap-10 pb-24">
        <div className="lg:col-span-7 bg-surface/60 border border-border rounded-3xl p-8 md:p-10">
          <ContactForm variant="full" source="contact" />
        </div>
        <aside className="lg:col-span-5 flex flex-col gap-5">
          <InfoCard icon={<Mail size={18} />} label="Email" value="hello@evimero.studio" />
          <InfoCard icon={<Phone size={18} />} label="WhatsApp" value="+1 (555) 010-2025" />
          <InfoCard icon={<MapPin size={18} />} label="Studio" value="Remote · Worldwide" />
          <div className="bg-surface/60 border border-border rounded-2xl p-6">
            <p className="text-xs uppercase tracking-widest text-foreground/70 mb-4">Find me on</p>
            <div className="flex gap-3">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-gold transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div className="bg-surface/60 border border-border rounded-2xl p-6 h-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            <div className="absolute inset-4 rounded-xl border border-dashed border-primary/40 flex items-center justify-center text-sm text-muted-foreground">
              📍 Studio map placeholder
            </div>
          </div>
        </aside>
      </section>

      {/* FAQ */}
      <section className="pb-32">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">[FAQ]</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">Common questions</h2>
        </div>
        <div className="max-w-3xl mx-auto divide-y divide-border border-y border-border">
          {faqs.map((f, i) => <FaqItem key={i} {...f} />)}
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-surface/60 border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-primary/50 transition-colors">
      <div className="w-11 h-11 rounded-full bg-primary/15 text-gold flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-display text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="w-full text-left py-6 group">
      <div className="flex items-center justify-between gap-6">
        <h4 className="font-display text-lg md:text-xl font-semibold group-hover:text-gold transition-colors">{q}</h4>
        <ChevronDown size={20} className={`text-gold shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}>
        <p className="overflow-hidden text-muted-foreground leading-relaxed">{a}</p>
      </div>
    </button>
  );
}
