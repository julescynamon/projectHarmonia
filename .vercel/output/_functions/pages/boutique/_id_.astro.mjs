/* empty css                                       */
import { e as createAstro, c as createComponent, a as renderTemplate, d as addAttribute, m as maybeRenderHead, r as renderComponent } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout, a as $$Cart } from '../../chunks/MainLayout_Nho3QixU.mjs';
import 'clsx';
import { b as getProduct } from '../../chunks/shop_BG2ZyLKw.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://project-harmonia.vercel.app");
const $$AddToCart = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AddToCart;
  const { productId, className = "" } = Astro2.props;
  Astro2.locals.session;
  return renderTemplate(_a || (_a = __template(["", "<button", "", ` aria-label="Ajouter au panier"> <span class="flex items-center justify-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path> </svg> <span>Ajouter au panier</span> </span> <div class="loading-spinner absolute inset-0 items-center justify-center" style="display: none;"> <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </div> </button> <script>
  function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-sage text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    
    // Ajout de l'ic\xF4ne d'information
    const icon = document.createElement('svg');
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    icon.setAttribute('class', 'h-5 w-5');
    icon.setAttribute('viewBox', '0 0 20 20');
    icon.setAttribute('fill', 'currentColor');
    icon.innerHTML = \`
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    \`;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(messageSpan);
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function handleAddToCart(button) {
    const spinner = button.querySelector('.loading-spinner');
    const content = button.querySelector('span');
    const productId = button.getAttribute('data-product-id');
    
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!productId || !UUID_REGEX.test(productId)) {
      console.error('ID du produit invalide:', productId);
      showError('Une erreur est survenue');
      return;
    }
    
    button.disabled = true;
    spinner.style.display = 'flex';
    content.classList.add('invisible');
    
    fetch('/api/cart/add', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ productId }),
      credentials: 'same-origin'
    })
      .then(async response => {
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
          }
          
          const data = await response.json();
          throw new Error(data.message || 'Une erreur est survenue');
        }
        
        // Mettre \xE0 jour le panier
        const cart = document.getElementById('cart');
        if (cart) {
          cart.classList.remove('translate-x-full');
          // D\xE9clencher la mise \xE0 jour du compteur
          window.dispatchEvent(new CustomEvent('cart:updated'));
        }

        // Mettre \xE0 jour l'apparence du bouton
        button.classList.remove('bg-primary');
        button.classList.add('bg-green-500');
        content.textContent = 'Ajout\xE9 !';
        content.classList.remove('invisible');
        
        setTimeout(() => {
          button.classList.remove('bg-green-500');
          button.classList.add('bg-primary');
          content.textContent = 'Ajouter au panier';
          button.disabled = false;
          spinner.style.display = 'none';
        }, 2000);
      })
      .catch(error => {
        console.error('Erreur lors de l\\'ajout au panier:', error);
        showError(error.message || 'Une erreur est survenue lors de l\\'ajout au panier');
        button.disabled = false;
        spinner.style.display = 'none';
        content.classList.remove('invisible');
      });
  }

  // Ajouter les \xE9couteurs d'\xE9v\xE9nements
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => handleAddToCart(button));
  });
<\/script>`], ["", "<button", "", ` aria-label="Ajouter au panier"> <span class="flex items-center justify-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path> </svg> <span>Ajouter au panier</span> </span> <div class="loading-spinner absolute inset-0 items-center justify-center" style="display: none;"> <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </div> </button> <script>
  function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-sage text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    
    // Ajout de l'ic\xF4ne d'information
    const icon = document.createElement('svg');
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    icon.setAttribute('class', 'h-5 w-5');
    icon.setAttribute('viewBox', '0 0 20 20');
    icon.setAttribute('fill', 'currentColor');
    icon.innerHTML = \\\`
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    \\\`;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(messageSpan);
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function handleAddToCart(button) {
    const spinner = button.querySelector('.loading-spinner');
    const content = button.querySelector('span');
    const productId = button.getAttribute('data-product-id');
    
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!productId || !UUID_REGEX.test(productId)) {
      console.error('ID du produit invalide:', productId);
      showError('Une erreur est survenue');
      return;
    }
    
    button.disabled = true;
    spinner.style.display = 'flex';
    content.classList.add('invisible');
    
    fetch('/api/cart/add', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ productId }),
      credentials: 'same-origin'
    })
      .then(async response => {
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
          }
          
          const data = await response.json();
          throw new Error(data.message || 'Une erreur est survenue');
        }
        
        // Mettre \xE0 jour le panier
        const cart = document.getElementById('cart');
        if (cart) {
          cart.classList.remove('translate-x-full');
          // D\xE9clencher la mise \xE0 jour du compteur
          window.dispatchEvent(new CustomEvent('cart:updated'));
        }

        // Mettre \xE0 jour l'apparence du bouton
        button.classList.remove('bg-primary');
        button.classList.add('bg-green-500');
        content.textContent = 'Ajout\xE9 !';
        content.classList.remove('invisible');
        
        setTimeout(() => {
          button.classList.remove('bg-green-500');
          button.classList.add('bg-primary');
          content.textContent = 'Ajouter au panier';
          button.disabled = false;
          spinner.style.display = 'none';
        }, 2000);
      })
      .catch(error => {
        console.error('Erreur lors de l\\\\'ajout au panier:', error);
        showError(error.message || 'Une erreur est survenue lors de l\\\\'ajout au panier');
        button.disabled = false;
        spinner.style.display = 'none';
        content.classList.remove('invisible');
      });
  }

  // Ajouter les \xE9couteurs d'\xE9v\xE9nements
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => handleAddToCart(button));
  });
<\/script>`])), maybeRenderHead(), addAttribute(productId, "data-product-id"), addAttribute(`add-to-cart-btn btn text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors relative ${className}`, "class"));
}, "/Users/jules/Downloads/harmonia/src/components/shop/AddToCart.astro", void 0);

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!id || typeof id !== "string" || !UUID_REGEX.test(id)) {
    return Astro2.redirect("/boutique");
  }
  const product = await getProduct(id);
  if (!product) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": product.title, "description": product.description.split("\n")[0] }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Cart", $$Cart, {})} ${maybeRenderHead()}<div class="pt-24"> <section class="py-20"> <div class="container mx-auto px-4"> <div class="max-w-4xl mx-auto"> <div class="grid md:grid-cols-2 gap-12"> <div data-aos="fade-right"> <img src="/images/default-pdf-cover.webp"${addAttribute(product.title, "alt")} loading="lazy" class="rounded-lg shadow-lg"> </div> <div data-aos="fade-left"> <span class="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4"> ${product.category} </span> <h1 class="text-4xl font-medium mb-4">${product.title}</h1> <div class="prose prose-lg mb-6"> ${product.description.split("\n\n").map((paragraph) => renderTemplate`<p>${paragraph}</p>`)} </div> <div class="flex items-center gap-6 mb-8"> <span class="text-3xl font-semibold">${product.price.toFixed(2)}€</span> ${product?.id && renderTemplate`${renderComponent($$result2, "AddToCart", $$AddToCart, { "productId": product.id })}`} </div> <div class="bg-gray-50 rounded-lg p-6"> <h2 class="font-medium text-lg mb-4">Informations importantes</h2> <ul class="space-y-2 text-gray-600"> <li class="flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path> </svg>
Téléchargement immédiat après paiement
</li> <li class="flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg>
Format PDF optimisé pour l'impression
</li> <li class="flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg>
Lien de téléchargement sécurisé
</li> </ul> </div> </div> </div> </div> </div> </section> </div> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/boutique/[id].astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/boutique/[id].astro";
const $$url = "/boutique/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
