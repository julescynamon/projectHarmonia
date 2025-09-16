import { s as supabase } from './supabase_CXSvBnpz.mjs';
import { s as supabase$1 } from './service-role_dH4Azpbt.mjs';
import { c as createClient } from './index_DeVVxtlF.mjs';

class Cache {
  static instance;
  cache;
  stats;
  options;
  cleanupInterval = null;
  supabase = createClient(
    "https://hvthtebjvmutuvzvttdb.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGh0ZWJqdm11dHV2enZ0dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTM5NTgsImV4cCI6MjA1MjI2OTk1OH0.gpI9njtvd6Mu_0wTnwfvtx0bFpUDNexuzwu3hgOGDdY"
  );
  constructor(options = {}) {
    this.cache = /* @__PURE__ */ new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      itemCount: 0
    };
    this.options = {
      maxSize: options.maxSize || 100 * 1024 * 1024,
      // 100MB par défaut
      maxItems: options.maxItems || 1e3,
      persistToDatabase: options.persistToDatabase || false,
      cleanupInterval: options.cleanupInterval || 5 * 60 * 1e3
      // 5 minutes
    };
    this.startCleanup();
  }
  static getInstance(options) {
    if (!Cache.instance) {
      Cache.instance = new Cache(options);
    }
    return Cache.instance;
  }
  async persistToDatabase(key, item) {
    if (!this.options.persistToDatabase) return;
    try {
      const { error } = await this.supabase.from("cache").upsert({
        key,
        data: item.data,
        timestamp: new Date(item.timestamp).toISOString(),
        expires_in: item.expiresIn / 1e3,
        // Convertir en secondes
        size: item.size
      });
      if (error) {
        console.error("Erreur lors de la persistance du cache:", error);
      }
    } catch (error) {
      console.error("Erreur lors de la persistance du cache:", error);
    }
  }
  async loadFromDatabase(key) {
    if (!this.options.persistToDatabase) return null;
    try {
      const { data, error } = await this.supabase.from("cache").select("*").eq("key", key).single();
      if (error || !data) return null;
      const item = {
        data: data.data,
        timestamp: new Date(data.timestamp).getTime(),
        expiresIn: (data.expires_in || 0) * 1e3,
        // Convertir en millisecondes
        size: data.size
      };
      if (Date.now() - item.timestamp > item.expiresIn) {
        await this.delete(key);
        return null;
      }
      return item;
    } catch (error) {
      console.error("Erreur lors du chargement du cache:", error);
      return null;
    }
  }
  calculateItemSize(item) {
    try {
      return new Blob([JSON.stringify(item)]).size;
    } catch {
      return 0;
    }
  }
  async cleanup() {
    const now = Date.now();
    let newSize = 0;
    let newCount = 0;
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiresIn) {
        this.cache.delete(key);
        if (this.options.persistToDatabase) {
          await this.supabase.from("cache").delete().eq("key", key);
        }
      } else {
        newSize += item.size;
        newCount++;
      }
    }
    this.stats.size = newSize;
    this.stats.itemCount = newCount;
  }
  startCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cleanupInterval = setInterval(() => {
      this.cleanup().catch(console.error);
    }, this.options.cleanupInterval);
  }
  async set(key, data, expiresIn = 5 * 60 * 1e3) {
    const size = this.calculateItemSize(data);
    if (this.stats.size + size > this.options.maxSize) {
      await this.cleanup();
      if (this.stats.size + size > this.options.maxSize) {
        throw new Error("Limite de taille du cache dépassée");
      }
    }
    if (this.stats.itemCount >= this.options.maxItems) {
      await this.cleanup();
      if (this.stats.itemCount >= this.options.maxItems) {
        throw new Error("Limite d'éléments du cache dépassée");
      }
    }
    const item = {
      data,
      timestamp: Date.now(),
      expiresIn,
      size
    };
    this.cache.set(key, item);
    this.stats.size += size;
    this.stats.itemCount++;
    if (this.options.persistToDatabase) {
      await this.persistToDatabase(key, item);
    }
  }
  async get(key) {
    let item = this.cache.get(key);
    if (!item && this.options.persistToDatabase) {
      item = await this.loadFromDatabase(key);
      if (item) {
        this.cache.set(key, item);
        this.stats.size += item.size;
        this.stats.itemCount++;
      }
    }
    if (!item) {
      this.stats.misses++;
      return null;
    }
    const now = Date.now();
    if (now - item.timestamp > item.expiresIn) {
      await this.delete(key);
      this.stats.misses++;
      return null;
    }
    this.stats.hits++;
    return item.data;
  }
  async clear() {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      itemCount: 0
    };
    if (this.options.persistToDatabase) {
      await this.supabase.from("cache").delete().neq("key", "");
    }
  }
  async delete(key) {
    const item = this.cache.get(key);
    if (item) {
      this.stats.size -= item.size;
      this.stats.itemCount--;
    }
    this.cache.delete(key);
    if (this.options.persistToDatabase) {
      await this.supabase.from("cache").delete().eq("key", key);
    }
  }
  getStats() {
    return { ...this.stats };
  }
  setOptions(options) {
    this.options = {
      ...this.options,
      ...options
    };
    this.startCleanup();
  }
}
const cache = Cache.getInstance();

const CACHE_DURATION = 10 * 1e3;
const PRODUCT_CACHE_KEY = "products";
async function getProducts(options = {}) {
  const {
    category = null,
    search = null,
    sort = "newest",
    minPrice = null,
    maxPrice = null
  } = options;
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    throw new Error("Le prix minimum ne peut pas être supérieur au prix maximum");
  }
  if (minPrice !== null && minPrice < 0) {
    throw new Error("Le prix minimum ne peut pas être négatif");
  }
  const validSorts = ["newest", "price-asc", "price-desc", "popular"];
  if (!validSorts.includes(sort)) {
    throw new Error("Option de tri invalide");
  }
  const cacheKey = `${PRODUCT_CACHE_KEY}-${JSON.stringify(options)}`;
  const isVolatileQuery = search || minPrice !== null || maxPrice !== null;
  const cacheDuration = isVolatileQuery ? CACHE_DURATION : CACHE_DURATION * 4;
  const cachedProducts = cache.get(cacheKey);
  if (cachedProducts) {
    return cachedProducts;
  }
  let query = supabase.from("products").select("id, title, description, price, category, pdf_path, created_at");
  if (category) {
    query = query.eq("category", category);
  }
  if (search) {
    const searchTerm = search.trim();
    if (searchTerm) {
      query = query.textSearch("search_vector", searchTerm, {
        config: "french",
        type: "plain"
      });
    }
  }
  if (minPrice !== null) {
    query = query.gte("price", minPrice);
  }
  if (maxPrice !== null) {
    query = query.lte("price", maxPrice);
  }
  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      if (search) {
        query = query.order("search_vector", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }
  try {
    const { data, error } = await query;
    if (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      throw error;
    }
    const products = data || [];
    if (sort === "popular" && !search) {
      products.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }
    if (products.length > 0) {
      cache.set(cacheKey, products, cacheDuration);
    }
    return products;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw new Error(
      "Une erreur est survenue lors de la récupération des produits. Veuillez réessayer plus tard."
    );
  }
}
async function getProduct(id) {
  if (!id) {
    console.error("ID du produit manquant");
    return null;
  }
  const cacheKey = `${PRODUCT_CACHE_KEY}-${id}`;
  const cachedProduct = cache.get(cacheKey);
  if (cachedProduct) {
    return cachedProduct;
  }
  try {
    const { data, error } = await supabase.from("products").select("id, title, description, price, category, pdf_path, created_at").eq("id", id).single();
    if (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      return null;
    }
    if (data) {
      cache.set(cacheKey, data, CACHE_DURATION * 4);
      return data;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return null;
  }
}
async function getDownloadUrl(productId, orderId, userId) {
  try {
    const { data: product, error: productError } = await supabase.from("products").select("pdf_path").eq("id", productId).single();
    if (productError || !product || !product.pdf_path) {
      console.error("Erreur ou produit non trouvé:", productError);
      return null;
    }
    const { data: order, error: orderError } = await supabase.from("orders").select(`
        id,
        user_id,
        order_items!inner (id, product_id, download_count)
      `).eq("id", orderId).eq("user_id", userId).single();
    console.log("Résultat vérification commande:", { order, error: orderError });
    if (orderError || !order) {
      console.error("Erreur de vérification de la commande:", orderError);
      return null;
    }
    const hasProduct = order.order_items.some((item) => item.product_id === productId);
    if (!hasProduct) {
      console.error("Le produit ne fait pas partie de la commande");
      return null;
    }
    const { data: buckets } = await supabase$1.storage.listBuckets();
    const { data: files, error: listError } = await supabase$1.storage.from("pdfs").list();
    console.log("Fichiers dans le bucket pdfs:", files);
    if (listError) {
      console.error("Erreur lors de la liste des fichiers:", listError);
    }
    console.log("Tentative de génération URL signée pour:", product.pdf_path);
    const { data: signedUrl, error: signedUrlError } = await supabase$1.storage.from("pdfs").createSignedUrl(product.pdf_path, 300);
    if (signedUrlError) {
      console.error("Erreur lors de la génération de l'URL signée:", signedUrlError);
      return null;
    }
    const { error: updateError } = await supabase.from("order_items").update({ download_count: (order.order_items[0].download_count || 0) + 1 }).eq("order_id", orderId).eq("product_id", productId);
    if (updateError) {
      console.error("Erreur lors de la mise à jour du compteur:", updateError);
    }
    console.log("URL signée générée:", signedUrl);
    return signedUrl?.signedUrl || null;
  } catch (error) {
    console.error("Erreur lors de la génération de l'URL:", error);
    return null;
  }
}
async function getCartItems(userId) {
  const { data, error } = await supabase.from("cart_items").select(`
      *,
      product:products (
        id,
        title,
        description,
        price,
        category
      )
    `).eq("user_id", userId);
  if (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    throw error;
  }
  return data || [];
}

export { getProducts as a, getProduct as b, getCartItems as c, getDownloadUrl as g };
