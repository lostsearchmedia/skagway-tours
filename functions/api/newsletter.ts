// POST /api/newsletter — accepts a newsletter email, writes to D1, redirects to /thanks/.
//
// Requires a D1 binding named `DB` on the Pages project. Schema lives in
// /db/schema.sql. The form lives in src/pages/contact.astro.
//
// Optional env vars for email notifications (via Brevo):
//   BREVO_KEY           — Brevo API v3 key (set as an encrypted variable).
//   NOTIFICATION_EMAIL  — where to send subscriber alerts.
//   BREVO_SENDER        — From address (defaults to forms@skagway.tours).
// If any are unset, the signup still saves to D1; email is skipped.

interface Env {
  DB: D1Database;
  BREVO_KEY?: string;
  NOTIFICATION_EMAIL?: string;
  BREVO_SENDER?: string;
}

function clean(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function backToForm(request: Request, error: string): Response {
  const url = new URL("/contact/", request.url);
  url.searchParams.set("error", error);
  return Response.redirect(url.toString(), 303);
}

async function sendBrevoEmail(env: Env, subject: string, textContent: string) {
  if (!env.BREVO_KEY || !env.NOTIFICATION_EMAIL) return;
  const sender = env.BREVO_SENDER || "forms@skagway.tours";
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Skagway Tours", email: sender },
      to: [{ email: env.NOTIFICATION_EMAIL }],
      subject,
      textContent,
    }),
  });
  if (!res.ok) {
    console.error("brevo send failed", res.status, await res.text());
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const form = await request.formData();

  if (clean(form.get("_gotcha"), 100)) {
    return Response.redirect(new URL("/thanks/?form=newsletter", request.url).toString(), 303);
  }

  const email = clean(form.get("email"), 320);

  if (!email || !email.includes("@")) {
    return backToForm(request, "validation");
  }

  let inserted = false;
  try {
    // UNIQUE(email) means a repeat signup is a no-op rather than an error.
    const result = await env.DB.prepare(
      `INSERT OR IGNORE INTO newsletter_subscribers (email, user_agent, ip)
       VALUES (?, ?, ?)`
    )
      .bind(
        email,
        request.headers.get("user-agent"),
        request.headers.get("cf-connecting-ip"),
      )
      .run();
    inserted = (result.meta?.changes ?? 0) > 0;
  } catch (err) {
    console.error("newsletter insert failed", err);
    return backToForm(request, "server");
  }

  // Only email on a genuinely new subscriber — repeat signups stay silent.
  if (inserted) {
    waitUntil(
      sendBrevoEmail(env, "New newsletter subscriber", `New subscriber: ${email}`),
    );
  }

  return Response.redirect(new URL("/thanks/?form=newsletter", request.url).toString(), 303);
};
