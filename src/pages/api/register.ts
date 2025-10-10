import type { APIRoute } from "astro";
import { createServerClient } from "@supabase/ssr";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const form = await request.formData();
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "");

    if (!email || !password || !name) {
      return redirect("/register?error=missing_fields", 302);
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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    
    if (error) {
      return redirect(`/register?error=${encodeURIComponent(error.message)}`, 302);
    }

    // Succès → redirection vers login avec message
    return redirect("/login?message=registration_success", 302);
  } catch (e) {
    return redirect("/register?error=unexpected_error", 302);
  }
};
