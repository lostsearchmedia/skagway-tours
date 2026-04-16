// POST /api/newsletter — accepts a newsletter email, writes to D1, redirects to /thanks/.
//
// Requires a D1 binding named `DB` on the Pages project. Schema lives in
// /db/schema.sql. The form lives in src/pages/contact.astro.

interface Env {
  DB: D1Database;
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();

  if (clean(form.get("_gotcha"), 100)) {
    return Response.redirect(new URL("/thanks/?form=newsletter", request.url).toString(), 303);
  }

  const email = clean(form.get("email"), 320);

  if (!email || !email.includes("@")) {
    return backToForm(request, "validation");
  }

  try {
    // UNIQUE(email) means a repeat signup is a no-op rather than an error.
    await env.DB.prepare(
      `INSERT OR IGNORE INTO newsletter_subscribers (email, user_agent, ip)
       VALUES (?, ?, ?)`
    )
      .bind(
        email,
        request.headers.get("user-agent"),
        request.headers.get("cf-connecting-ip"),
      )
      .run();
  } catch (err) {
    console.error("newsletter insert failed", err);
    return backToForm(request, "server");
  }

  return Response.redirect(new URL("/thanks/?form=newsletter", request.url).toString(), 303);
};
