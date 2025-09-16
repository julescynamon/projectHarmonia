import { c as createServerClient } from '../../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../../renderers.mjs';

async function handleSignOut({ cookies, locals, request }) {
  const cookiesHeader = request.headers.get("cookie");
  const supabase = createServerClient(cookiesHeader);
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Erreur lors de la déconnexion Supabase:", error);
  }
  request.headers.get("cookie");
  function deleteWithAllOptions(name) {
    const options = [
      { path: "/" },
      { path: "/", secure: true, httpOnly: true, sameSite: "lax" },
      { path: "/", httpOnly: true },
      { path: "/", domain: request.headers.get("host")?.split(":")[0] }
    ];
    options.forEach((opt) => {
      cookies.delete(name, opt);
      if (name.includes(".")) {
        cookies.delete(decodeURIComponent(name), opt);
      }
    });
  }
  const cookiesToRemove = [
    "sb-access-token",
    "sb-refresh-token",
    "supabase-auth-token",
    "supabase.auth.token"
  ];
  cookiesToRemove.forEach((name) => {
    deleteWithAllOptions(name);
  });
  const expires = (/* @__PURE__ */ new Date(0)).toUTCString();
  const domain = request.headers.get("host")?.split(":")[0];
  const cookieHeaders = cookiesToRemove.flatMap((name) => [
    // Version basique
    `${name}=; path=/; expires=${expires}`,
    // Version avec HttpOnly
    `${name}=; path=/; expires=${expires}; HttpOnly`,
    // Version avec domain
    `${name}=; path=/; expires=${expires}; domain=${domain}`,
    // Version complète
    `${name}=; path=/; expires=${expires}; HttpOnly; domain=${domain}; SameSite=Lax`
  ]);
  locals.session = null;
  const headers = new Headers({
    "Location": "/",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  });
  cookieHeaders.forEach((cookie) => {
    headers.append("Set-Cookie", cookie);
  });
  return new Response(null, {
    status: 302,
    headers
  });
}
const POST = async (context) => {
  try {
    return await handleSignOut(context);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return new Response("Erreur lors de la déconnexion", { status: 500 });
  }
};
const GET = async (context) => {
  try {
    return await handleSignOut(context);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return new Response("Erreur lors de la déconnexion", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
