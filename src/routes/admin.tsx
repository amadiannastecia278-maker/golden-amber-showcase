import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, LogOut, Upload, Pencil, Eye, EyeOff, X } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — EVIMERO" }] }),
});

type Project = {
  id: string; title: string; category: string; description: string;
  tools: string | null; external_link: string | null; image_url: string; published: boolean;
  slug: string | null;
};

const CATS = ["Branding", "Web Design", "Photography", "Motion"];

function Admin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", category: "Branding", description: "", tools: "", external_link: "", image_url: "", published: true, slug: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUserId(s?.user.id ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null;
      setUserId(uid);
      if (!uid) navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
      let admin = !!data;
      if (!admin) {
        // Try to bootstrap as first admin (RLS allows only when no admin exists)
        const { error: insErr } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (!insErr) {
          admin = true;
          toast.success("Admin access granted");
        }
      }
      setIsAdmin(admin);
      if (admin) loadProjects();
    })();
  }, [userId]);

  const loadProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data as Project[]);
  };

  const handleFile = async (file: File) => {
    if (!userId) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file);
    if (error) { setUploading(false); toast.error(error.message); return; }
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) return toast.error("Upload a project image first");
    const payload = {
      title: form.title, category: form.category, description: form.description,
      tools: form.tools || null, external_link: form.external_link || null,
      image_url: form.image_url, published: form.published,
      slug: (form.slug || form.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || null,
    };
    const { error } = editingId
      ? await supabase.from("projects").update(payload).eq("id", editingId)
      : await supabase.from("projects").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Project updated" : "Project saved");
    resetForm();
    loadProjects();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", category: "Branding", description: "", tools: "", external_link: "", image_url: "", published: true, slug: "" });
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title, category: p.category, description: p.description,
      tools: p.tools ?? "", external_link: p.external_link ?? "",
      image_url: p.image_url, published: p.published,
      slug: p.slug ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePublished = async (p: Project) => {
    const { error } = await supabase.from("projects").update({ published: !p.published }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(!p.published ? "Published" : "Moved to draft");
    loadProjects();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    loadProjects();
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  if (userId === null) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center bg-surface p-10 rounded-3xl border border-border">
          <h1 className="font-display text-2xl font-bold mb-3">Not authorized</h1>
          <p className="text-muted-foreground text-sm mb-2">
            Your account ({userId.slice(0, 8)}...) needs the <span className="text-gold">admin</span> role.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Ask the project owner to grant access by inserting a row into <code className="text-gold">user_roles</code> with your user id.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={signOut} className="px-5 py-2.5 rounded-full border border-border hover:border-primary text-sm">Sign out</button>
            <Link to="/" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm">Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-8 py-5 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-gold">EVIMERO<span className="text-foreground">.</span> <span className="text-muted-foreground text-sm">/ admin</span></Link>
        <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"><LogOut size={16} /> Sign out</button>
      </header>

      <div className="max-w-6xl mx-auto p-8 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            {editingId ? <Pencil size={20} /> : <Plus size={20} />} {editingId ? "Edit Project" : "New Project"}
            {editingId && (
              <button type="button" onClick={resetForm} className="ml-auto text-xs text-muted-foreground hover:text-gold inline-flex items-center gap-1">
                <X size={14} /> Cancel
              </button>
            )}
          </h2>
          <form onSubmit={submit} className="grid gap-3 bg-surface border border-border rounded-2xl p-6">
            <input required placeholder="Title" className="rounded-lg bg-background border border-border px-3 py-2.5 focus:border-primary outline-none"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input placeholder="Slug (auto from title if blank)" className="rounded-lg bg-background border border-border px-3 py-2.5 focus:border-primary outline-none font-mono text-sm"
              value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <select className="rounded-lg bg-background border border-border px-3 py-2.5 focus:border-primary outline-none"
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <textarea required placeholder="Description" className="rounded-lg bg-background border border-border px-3 py-2.5 min-h-24 focus:border-primary outline-none"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Tools used" className="rounded-lg bg-background border border-border px-3 py-2.5 focus:border-primary outline-none"
              value={form.tools} onChange={(e) => setForm({ ...form, tools: e.target.value })} />
            <input placeholder="External link (optional)" className="rounded-lg bg-background border border-border px-3 py-2.5 focus:border-primary outline-none"
              value={form.external_link} onChange={(e) => setForm({ ...form, external_link: e.target.value })} />

            <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary rounded-lg py-6 text-sm text-muted-foreground transition-colors">
              <Upload size={16} />
              {uploading ? "Uploading..." : form.image_url ? "Replace image" : "Upload project image"}
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </label>
            {form.image_url && <img src={form.image_url} alt="" className="rounded-lg max-h-40 object-cover w-full" />}

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              {form.published ? "Published" : "Draft"}
            </label>

            <button className="rounded-full bg-primary text-primary-foreground font-semibold py-3 hover:bg-primary-glow transition-colors">
              {editingId ? "Update Project" : "Save Project"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-display text-2xl font-bold mb-6">Projects ({projects.length})</h2>
          <div className="grid gap-4">
            {projects.map((p) => (
              <div key={p.id} className="flex gap-4 bg-surface border border-border rounded-xl p-4">
                <img src={p.image_url} alt="" className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest text-gold">{p.category}</p>
                  <h3 className="font-display text-lg font-semibold truncate">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  <p className="text-xs mt-1">{p.published ? <span className="text-green-400">Live</span> : <span className="text-muted-foreground">Draft</span>}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button title={p.published ? "Unpublish" : "Publish"} onClick={() => togglePublished(p)} className="text-muted-foreground hover:text-gold p-2">
                    {p.published ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button title="Edit" onClick={() => startEdit(p)} className="text-muted-foreground hover:text-foreground p-2"><Pencil size={18} /></button>
                  <button title="Delete" onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-muted-foreground text-sm">No projects yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
