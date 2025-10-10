import type { APIRoute } from "astro";
import { createServerClient } from "@supabase/ssr";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const form = await request.formData();
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    if (!email || !password) {
      return redirect("/login?error=missing_fields", 302);
    }

    const supabase = createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL!,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (key) => cookies.get(key)?.value,
          set: (key, value, options) => cookies.set(key, value, options),
          remove: (key, options) => cookies.delete(key, options),
        },
      }
    );

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return redirect(`/login?error=${encodeURIComponent(error.message)}`, 302);
    }

    // Succès → les cookies httpOnly sont en place
    return redirect("/", 302);
  } catch (e) {
    return redirect("/login?error=unexpected_error", 302);
  }
};
