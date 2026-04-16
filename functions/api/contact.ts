// POST /api/contact — accepts the contact form, writes to D1, redirects to /thanks/.
//
// Requires a D1 binding named `DB` on the Pages project. Schema lives in
// /db/schema.sql. The form lives in src/pages/contact.astro.

interface Env {
  DB: D1Database;
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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

  return Response.redirect(new URL("/thanks/?form=contact", request.url).toString(), 303);
};
