import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: Auth,
  head: () => ({ meta: [{ title: "Sign in — EVIMERO" }] }),
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Check your email to confirm.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/admin" });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-10">
        <h1 className="font-display text-3xl font-bold mb-2">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
        <p className="text-muted-foreground text-sm mb-8">EVIMERO admin access</p>
        <form onSubmit={submit} className="grid gap-4">
          <input className="w-full rounded-lg bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary"
            type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-lg bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary"
            type="password" required minLength={6} placeholder="Password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="rounded-full bg-primary text-primary-foreground font-semibold py-3 hover:bg-primary-glow shadow-gold transition-colors disabled:opacity-60">
            {loading ? "..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-6 text-sm text-muted-foreground hover:text-gold transition-colors w-full text-center">
          {mode === "signin" ? "No account? Create one" : "Already have one? Sign in"}
        </button>
      </div>
    </div>
  );
}
