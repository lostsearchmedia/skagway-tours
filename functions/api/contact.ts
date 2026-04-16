// POST /api/contact — accepts the contact form, writes to D1, redirects to /thanks/.
//
// Requires a D1 binding named `DB` on the Pages project. Schema lives in
// /db/schema.sql. The form lives in src/pages/contact.astro.
//
// Optional env vars for email notifications (via Brevo):
//   BREVO_KEY           — Brevo API v3 key (set as an encrypted variable).
//   NOTIFICATION_EMAIL  — where to send form alerts.
//   BREVO_SENDER        — From address (defaults to forms@skagway.tours).
// If any are unset, the form still saves to D1; email is skipped.

interface Env {
  DB: D1Database;
  BREVO_KEY?: string;
  NOTIFICATION_EMAIL?: string;
  BREVO_SENDER?: string;
}

const FIELD_LIMITS = {
  name: 200,
  email: 320,
  subject: 200,
  message: 5000,
};

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

  // Honeypot — real users never fill this hidden field.
  if (clean(form.get("_gotcha"), 100)) {
    return Response.redirect(new URL("/thanks/?form=contact", request.url).toString(), 303);
  }

  const name = clean(form.get("name"), FIELD_LIMITS.name);
  const email = clean(form.get("email"), FIELD_LIMITS.email);
  const subject = clean(form.get("subject"), FIELD_LIMITS.subject);
  const message = clean(form.get("message"), FIELD_LIMITS.message);

  if (!name || !email || !message || !email.includes("@")) {
    return backToForm(request, "validation");
  }

  try {
    await env.DB.prepare(
      `INSERT INTO contact_submissions (name, email, subject, message, user_agent, ip)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        name,
        email,
        subject || null,
        message,
        request.headers.get("user-agent"),
        request.headers.get("cf-connecting-ip"),
      )
      .run();
  } catch (err) {
    console.error("contact insert failed", err);
    return backToForm(request, "server");
  }

  const emailBody = [
    `New contact form submission on skagway.tours`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject || "(none)"}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  waitUntil(sendBrevoEmail(env, `New contact: ${name}`, emailBody));

  return Response.redirect(new URL("/thanks/?form=contact", request.url).toString(), 303);
};
