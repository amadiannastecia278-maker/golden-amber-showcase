import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TO_EMAIL = "amzybaby125@gmail.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
// Override by setting the RESEND_FROM_EMAIL secret to e.g. "EVIMERO <hello@evimero.studio>"
// Domain MUST be verified in Resend or sends will be rejected.
const DEFAULT_FROM = "EVIMERO Contact <onboarding@resend.dev>";

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { full_name, email, subject, message, phone, budget_range, source } = body ?? {};

    if (!full_name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ts = new Date().toISOString();
    const html = `
      <div style="font-family: -apple-system, sans-serif; background:#f6f6f6; padding:24px;">
        <div style="max-width:560px;margin:auto;background:#fff;border-radius:12px;padding:28px;border-top:4px solid #E5A000">
          <h2 style="margin:0 0 4px;color:#1C1C1E">New ${escapeHtml(source || "website")} enquiry</h2>
          <p style="color:#888;margin:0 0 20px;font-size:12px">${escapeHtml(ts)}</p>
          <p><strong>Name:</strong> ${escapeHtml(full_name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
          ${budget_range ? `<p><strong>Budget:</strong> ${escapeHtml(budget_range)}</p>` : ""}
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:18px 0" />
          <p style="white-space:pre-wrap;color:#333;line-height:1.6">${escapeHtml(message)}</p>
        </div>
      </div>`;

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: Deno.env.get("RESEND_FROM_EMAIL") || DEFAULT_FROM,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[EVIMERO] ${subject}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error", res.status, data);
      return new Response(JSON.stringify({ error: "Email failed", details: data }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});