/* empty css                                    */
import { c as createComponent, a as renderTemplate, f as defineScriptVars, m as maybeRenderHead, e as createAstro, r as renderComponent } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_BPgP8eEd.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$ForgotPasswordForm = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", '<form class="space-y-6" data-forgot-password-form> <div> <label for="email" class="block text-sm font-medium text-gray-700">Email</label> <input type="email" id="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20" placeholder="Entrez votre adresse email"> </div> <button type="submit" class="w-full btn px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">\nRéinitialiser le mot de passe\n</button> <div class="text-center"> <a href="/login" class="text-primary hover:text-primary/80 text-sm">\nRetour à la connexion\n</a> </div> <div class="text-red-500 text-sm hidden" data-error></div> <div class="text-green-500 text-sm hidden" data-success></div> </form> <script>(function(){', `
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  function initForgotPasswordForm() {
    const form = document.querySelector('[data-forgot-password-form]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formEl = e.target as HTMLFormElement;
      const errorEl = formEl.querySelector('[data-error]');
      const successEl = formEl.querySelector('[data-success]');
      const submitButton = formEl.querySelector('button[type="submit"]') as HTMLButtonElement;
      const email = (formEl.querySelector('#email') as HTMLInputElement).value;

      try {
        submitButton.disabled = true;
        errorEl.classList.add('hidden');
        successEl.classList.add('hidden');

        // Utiliser la méthode Supabase pour réinitialiser le mot de passe
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: \`\${window.location.origin}/reinitialiser-mot-de-passe\`,
        });

        if (resetError) throw resetError;

        successEl.textContent = "Un email de réinitialisation a été envoyé à votre adresse email.";
        successEl.classList.remove('hidden');
        formEl.reset();
      } catch (error) {
        console.error('Erreur:', error);
        errorEl.textContent = "Une erreur est survenue. Veuillez réessayer.";
        errorEl.classList.remove('hidden');
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  // S'assurer que le code s'exécute uniquement côté client
  if (typeof window !== 'undefined') {
    initForgotPasswordForm();
  }
})();</script>`], ["", '<form class="space-y-6" data-forgot-password-form> <div> <label for="email" class="block text-sm font-medium text-gray-700">Email</label> <input type="email" id="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20" placeholder="Entrez votre adresse email"> </div> <button type="submit" class="w-full btn px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">\nRéinitialiser le mot de passe\n</button> <div class="text-center"> <a href="/login" class="text-primary hover:text-primary/80 text-sm">\nRetour à la connexion\n</a> </div> <div class="text-red-500 text-sm hidden" data-error></div> <div class="text-green-500 text-sm hidden" data-success></div> </form> <script>(function(){', `
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  function initForgotPasswordForm() {
    const form = document.querySelector('[data-forgot-password-form]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formEl = e.target as HTMLFormElement;
      const errorEl = formEl.querySelector('[data-error]');
      const successEl = formEl.querySelector('[data-success]');
      const submitButton = formEl.querySelector('button[type="submit"]') as HTMLButtonElement;
      const email = (formEl.querySelector('#email') as HTMLInputElement).value;

      try {
        submitButton.disabled = true;
        errorEl.classList.add('hidden');
        successEl.classList.add('hidden');

        // Utiliser la méthode Supabase pour réinitialiser le mot de passe
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: \\\`\\\${window.location.origin}/reinitialiser-mot-de-passe\\\`,
        });

        if (resetError) throw resetError;

        successEl.textContent = "Un email de réinitialisation a été envoyé à votre adresse email.";
        successEl.classList.remove('hidden');
        formEl.reset();
      } catch (error) {
        console.error('Erreur:', error);
        errorEl.textContent = "Une erreur est survenue. Veuillez réessayer.";
        errorEl.classList.remove('hidden');
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  // S'assurer que le code s'exécute uniquement côté client
  if (typeof window !== 'undefined') {
    initForgotPasswordForm();
  }
})();</script>`])), maybeRenderHead(), defineScriptVars({ supabaseUrl: "https://hvthtebjvmutuvzvttdb.supabase.co", supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGh0ZWJqdm11dHV2enZ0dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTM5NTgsImV4cCI6MjA1MjI2OTk1OH0.gpI9njtvd6Mu_0wTnwfvtx0bFpUDNexuzwu3hgOGDdY" }));
}, "/Users/jules/Downloads/harmonia/src/components/auth/ForgotPasswordForm.astro", void 0);

const $$Astro = createAstro("https://harmonia.jules.com");
const $$MotDePasseOublie = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MotDePasseOublie;
  const supabase = Astro2.locals.supabase;
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    return Astro2.redirect("/mon-compte");
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Mot de passe oubli\xE9", "description": "R\xE9initialisez votre mot de passe" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="pt-24"> <section class="py-20"> <div class="container mx-auto px-4"> <div class="max-w-md mx-auto"> <h1 class="text-2xl font-bold text-center mb-8">Mot de passe oublié</h1> ${renderComponent($$result2, "ForgotPasswordForm", $$ForgotPasswordForm, {})} </div> </div> </section> </div> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/mot-de-passe-oublie.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/mot-de-passe-oublie.astro";
const $$url = "/mot-de-passe-oublie";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MotDePasseOublie,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
