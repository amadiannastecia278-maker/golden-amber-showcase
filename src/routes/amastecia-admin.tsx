import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, LogOut, Upload, Pencil, Eye, EyeOff, X, FolderKanban, Store } from "lucide-react";

const ADMIN_EMAIL = "amzybaby125@gmail.com";

export const Route = createFileRoute("/amastecia-admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin", robots: "noindex,nofollow" }] }),
});

type Project = { id: string; title: string; category: string; description: string; tools: string | null; external_link: string | null; image_url: string; published: boolean; slug: string | null };
type Template = { id: string; title: string; description: string; category: string; price: number; currency: string; preview_image_url: string; file_url: string | null; payment_link: string | null; is_free: boolean; published: boolean };

function Admin() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"projects" | "shop">("projects");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.user) {
        if (s.user.email === ADMIN_EMAIL) { setAuthed(true); setReady(true); }
        else { supabase.auth.signOut(); navigate({ to: "/404" as any }).catch(() => navigate({ to: "/" })); }
      } else { setAuthed(false); setReady(true); }
    });
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u && u.email !== ADMIN_EMAIL) {
        supabase.auth.signOut();
        navigate({ to: "/404" as any }).catch(() => navigate({ to: "/" }));
      }
      if (u && u.email === ADMIN_EMAIL) setAuthed(true);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== ADMIN_EMAIL) { toast.error("Unauthorized"); return; }
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/amastecia-admin` } });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. If email confirmation is enabled, check your inbox; otherwise sign in now.");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
    }
  };

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 grain relative">
        <div className="border-gradient w-full max-w-md rounded-3xl p-10 relative">
          <h1 className="font-display text-3xl font-bold gradient-silver-text mb-2">Restricted</h1>
          <p className="text-muted-foreground text-sm mb-8">Authorized personnel only.</p>
          <form onSubmit={submit} className="grid gap-4">
            <input className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.2)] px-4 py-3 focus:outline-none focus:border-silver"
              type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.2)] px-4 py-3 focus:outline-none focus:border-silver"
              type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button disabled={loading} className="rounded-full gradient-button text-black font-semibold py-3 shadow-silver disabled:opacity-60">
              {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-6 text-xs text-muted-foreground hover:text-silver w-full text-center">
            {mode === "signin" ? "First time? Create the admin account" : "Have an account? Sign in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[rgba(192,192,192,0.15)] px-6 md:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold gradient-silver-text">Annastecia<span className="text-muted-foreground text-sm font-sans"> / admin</span></Link>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-silver"><LogOut size={16} /> Sign out</button>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex gap-2 mb-8">
          <TabBtn active={tab === "projects"} onClick={() => setTab("projects")} icon={<FolderKanban size={16} />}>Projects</TabBtn>
          <TabBtn active={tab === "shop"} onClick={() => setTab("shop")} icon={<Store size={16} />}>Shop</TabBtn>
        </div>
        {tab === "projects" ? <ProjectsPanel /> : <ShopPanel />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children, icon }: any) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${active ? "gradient-button text-black shadow-silver" : "border border-[rgba(192,192,192,0.2)] text-muted-foreground hover:text-foreground hover:border-silver"}`}>
      {icon} {children}
    </button>
  );
}

const CATS = ["Web Apps", "Mobile Apps", "UI/UX", "Open Source", "Backend"];

function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "Web Apps", description: "", tools: "", external_link: "", image_url: "", published: true, slug: "" });
  const [uploading, setUploading] = useState(false);

  const load = () => supabase.from("projects").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setProjects(data as Project[]));
  useEffect(() => { load(); }, []);

  const reset = () => { setEditingId(null); setForm({ title: "", category: "Web Apps", description: "", tools: "", external_link: "", image_url: "", published: true, slug: "" }); };

  const handleFile = async (file: File) => {
    setUploading(true);
    const { data: u } = await supabase.auth.getUser();
    const ext = file.name.split(".").pop();
    const path = `${u.user!.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file);
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false); toast.success("Image uploaded");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) return toast.error("Upload a project image");
    const payload = {
      title: form.title, category: form.category, description: form.description,
      tools: form.tools || null, external_link: form.external_link || null,
      image_url: form.image_url, published: form.published,
      slug: (form.slug || form.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || null,
    };
    const { error } = editingId ? await supabase.from("projects").update(payload).eq("id", editingId) : await supabase.from("projects").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Updated" : "Saved");
    reset(); load();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2">
        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
          {editingId ? <><Pencil size={18} /> Edit Project</> : <><Plus size={18} /> New Project</>}
          {editingId && <button type="button" onClick={reset} className="ml-auto text-xs text-muted-foreground hover:text-silver inline-flex items-center gap-1"><X size={14} /> Cancel</button>}
        </h2>
        <form onSubmit={submit} className="grid gap-3 border-gradient rounded-2xl p-6">
          <input required placeholder="Title" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Slug (auto)" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none font-mono text-sm" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <select className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea required placeholder="Description" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 min-h-24 focus:border-silver outline-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Tech stack (comma-separated)" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none" value={form.tools} onChange={(e) => setForm({ ...form, tools: e.target.value })} />
          <input placeholder="Live URL" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none" value={form.external_link} onChange={(e) => setForm({ ...form, external_link: e.target.value })} />
          <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-[rgba(192,192,192,0.25)] hover:border-silver rounded-lg py-6 text-sm text-muted-foreground transition-colors">
            <Upload size={16} />{uploading ? "Uploading..." : form.image_url ? "Replace image" : "Drop or upload image"}
            <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
          {form.image_url && <img src={form.image_url} alt="" className="rounded-lg max-h-40 object-cover w-full" />}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            {form.published ? "Published" : "Draft"}
          </label>
          <button className="rounded-full gradient-button text-black font-semibold py-3 shadow-silver">{editingId ? "Update" : "Save"}</button>
        </form>
      </div>

      <div className="lg:col-span-3">
        <h2 className="font-display text-2xl font-bold mb-6">Projects ({projects.length})</h2>
        <div className="grid gap-4">
          {projects.map((p) => (
            <div key={p.id} className="flex gap-4 border-gradient rounded-xl p-4">
              <img src={p.image_url} alt="" className="w-24 h-24 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver">{p.category}</p>
                <h3 className="font-display text-lg font-semibold truncate">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                <p className="text-xs mt-1">{p.published ? <span className="text-emerald-400">Live</span> : <span className="text-muted-foreground">Draft</span>}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={async () => { await supabase.from("projects").update({ published: !p.published }).eq("id", p.id); load(); }} className="text-muted-foreground hover:text-silver p-2">
                  {p.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button onClick={() => { setEditingId(p.id); setForm({ title: p.title, category: p.category, description: p.description, tools: p.tools ?? "", external_link: p.external_link ?? "", image_url: p.image_url, published: p.published, slug: p.slug ?? "" }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-muted-foreground hover:text-foreground p-2"><Pencil size={18} /></button>
                <button onClick={async () => { if (confirm("Delete?")) { await supabase.from("projects").delete().eq("id", p.id); load(); } }} className="text-muted-foreground hover:text-destructive p-2"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-muted-foreground text-sm">No projects yet.</p>}
        </div>
      </div>
    </div>
  );
}

function ShopPanel() {
  const [items, setItems] = useState<Template[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Template", price: 0, currency: "NGN", preview_image_url: "", file_url: "", payment_link: "", is_free: true, published: true });
  const [uploading, setUploading] = useState<"img" | "file" | null>(null);

  const load = () => supabase.from("templates").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setItems(data as Template[]));
  useEffect(() => { load(); }, []);

  const reset = () => { setEditingId(null); setForm({ title: "", description: "", category: "Template", price: 0, currency: "NGN", preview_image_url: "", file_url: "", payment_link: "", is_free: true, published: true }); };

  const handleUpload = async (file: File, kind: "img" | "file") => {
    setUploading(kind);
    const { data: u } = await supabase.auth.getUser();
    const ext = file.name.split(".").pop();
    const path = `${u.user!.id}/${crypto.randomUUID()}.${ext}`;
    const bucket = kind === "img" ? "template-previews" : "template-files";
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) { setUploading(null); return toast.error(error.message); }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setForm((f) => ({ ...f, [kind === "img" ? "preview_image_url" : "file_url"]: data.publicUrl }));
    setUploading(null); toast.success("Uploaded");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.preview_image_url) return toast.error("Upload a preview image");
    const payload = {
      title: form.title, description: form.description, category: form.category,
      price: Number(form.price), currency: form.currency,
      preview_image_url: form.preview_image_url,
      file_url: form.file_url || null,
      payment_link: form.payment_link || null,
      is_free: form.is_free, published: form.published,
    };
    const { error } = editingId ? await supabase.from("templates").update(payload).eq("id", editingId) : await supabase.from("templates").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Updated" : "Saved");
    reset(); load();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2">
        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
          {editingId ? <><Pencil size={18} /> Edit Template</> : <><Plus size={18} /> New Template</>}
          {editingId && <button type="button" onClick={reset} className="ml-auto text-xs text-muted-foreground hover:text-silver inline-flex items-center gap-1"><X size={14} /> Cancel</button>}
        </h2>
        <form onSubmit={submit} className="grid gap-3 border-gradient rounded-2xl p-6">
          <input required placeholder="Title" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea required placeholder="Description" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 min-h-20 focus:border-silver outline-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Category" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} />
            {form.is_free ? "Free template" : "Paid template"}
          </label>
          {!form.is_free && (
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="Price" className="col-span-2 rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <input placeholder="NGN" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </div>
          )}
          {!form.is_free && <input placeholder="Paystack/Gumroad payment link" className="rounded-lg bg-[#0A0A0A] border border-[rgba(192,192,192,0.15)] px-3 py-2.5 focus:border-silver outline-none" value={form.payment_link} onChange={(e) => setForm({ ...form, payment_link: e.target.value })} />}

          <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-[rgba(192,192,192,0.25)] hover:border-silver rounded-lg py-5 text-sm text-muted-foreground">
            <Upload size={16} />{uploading === "img" ? "Uploading..." : form.preview_image_url ? "Replace preview" : "Preview image"}
            <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "img")} />
          </label>
          {form.preview_image_url && <img src={form.preview_image_url} alt="" className="rounded-lg max-h-32 object-cover w-full" />}

          {form.is_free && (
            <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-[rgba(192,192,192,0.25)] hover:border-silver rounded-lg py-5 text-sm text-muted-foreground">
              <Upload size={16} />{uploading === "file" ? "Uploading..." : form.file_url ? "Replace file" : "Template file (zip/pdf)"}
              <input type="file" hidden onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "file")} />
            </label>
          )}

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            {form.published ? "Published" : "Draft"}
          </label>
          <button className="rounded-full gradient-button text-black font-semibold py-3 shadow-silver">{editingId ? "Update" : "Save"}</button>
        </form>
      </div>

      <div className="lg:col-span-3">
        <h2 className="font-display text-2xl font-bold mb-6">Templates ({items.length})</h2>
        <div className="grid gap-4">
          {items.map((t) => (
            <div key={t.id} className="flex gap-4 border-gradient rounded-xl p-4">
              <img src={t.preview_image_url} alt="" className="w-24 h-24 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver">{t.is_free ? "Free" : `${t.currency} ${t.price}`}</p>
                <h3 className="font-display text-lg font-semibold truncate">{t.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                <p className="text-xs mt-1">{t.published ? <span className="text-emerald-400">Live</span> : <span className="text-muted-foreground">Draft</span>}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={async () => { await supabase.from("templates").update({ published: !t.published }).eq("id", t.id); load(); }} className="text-muted-foreground hover:text-silver p-2">
                  {t.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button onClick={() => { setEditingId(t.id); setForm({ title: t.title, description: t.description, category: t.category, price: Number(t.price), currency: t.currency, preview_image_url: t.preview_image_url, file_url: t.file_url ?? "", payment_link: t.payment_link ?? "", is_free: t.is_free, published: t.published }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-muted-foreground hover:text-foreground p-2"><Pencil size={18} /></button>
                <button onClick={async () => { if (confirm("Delete?")) { await supabase.from("templates").delete().eq("id", t.id); load(); } }} className="text-muted-foreground hover:text-destructive p-2"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-muted-foreground text-sm">No templates yet.</p>}
        </div>
      </div>
    </div>
  );
}
