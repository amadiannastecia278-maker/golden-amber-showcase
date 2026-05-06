import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getProjectByIdent = createServerFn({ method: "GET" })
  .inputValidator((data: { ident: string }) => data)
  .handler(async ({ data }) => {
    const ident = data.ident;
    // Try slug first, then UUID id
    const { data: bySlug } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("slug", ident)
      .eq("published", true)
      .maybeSingle();
    if (bySlug) return { project: bySlug };

    const { data: byId } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", ident)
      .eq("published", true)
      .maybeSingle();
    return { project: byId ?? null };
  });