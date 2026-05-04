import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const baseSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(2, "Subject is required").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 chars").max(2000),
  budget_range: z.string().optional(),
});

type Variant = "compact" | "full";

export function ContactForm({ variant = "compact", source = "home" }: { variant?: Variant; source?: string }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", subject: "", message: "", budget_range: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = baseSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      budget_range: parsed.data.budget_range || null,
      source,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send. Try again.");
      return;
    }
    toast.success("Message sent. EVIMERO will be in touch.");
    setForm({ full_name: "", email: "", phone: "", subject: "", message: "", budget_range: "" });
  };

  const inputClass = "w-full rounded-lg bg-surface border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input className={inputClass} placeholder="Full Name *"
          value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input className={inputClass} type="email" placeholder="Email Address *"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      {variant === "full" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <input className={inputClass} placeholder="Phone (optional)"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <select className={inputClass} value={form.budget_range}
            onChange={(e) => setForm({ ...form, budget_range: e.target.value })}>
            <option value="">Budget Range</option>
            <option>Under $500</option>
            <option>$500 – $2,000</option>
            <option>$2,000 – $5,000</option>
            <option>$5,000+</option>
          </select>
        </div>
      )}
      <input className={inputClass} placeholder="Subject *"
        value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      <textarea className={inputClass + " min-h-[140px] resize-none"} placeholder="Tell us about your project... *"
        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold py-3.5 px-8 hover:bg-primary-glow transition-colors shadow-gold disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
