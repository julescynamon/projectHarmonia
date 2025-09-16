import { c as createServerClient } from '../../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../../renderers.mjs';

const supabase = createServerClient();
const POST = async ({ request, cookies }) => {
  try {
    const { session } = await request.json();
    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Session invalide" }),
        { status: 400 }
      );
    }
    const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: "Session expirée ou invalide" }),
        { status: 401 }
      );
    }
    cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 6,
      // 6 heures
      path: "/"
    });
    cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      // 30 jours
      path: "/"
    });
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la synchronisation de session:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
