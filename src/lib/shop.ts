import { supabase } from "./supabase";
import { cache } from "./cache";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PRODUCT_CACHE_KEY = "products";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  pdf_path?: string;
  created_at: string;
}

interface GetProductsOptions {
  category?: string | null;
  search?: string | null;
  sort?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}

interface OrderItem {
  products: {
    pdf_path: string;
  };
  download_count: number;
}

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<Product[]> {
  const {
    category = null,
    search = null,
    sort = "newest",
    minPrice = null,
    maxPrice = null,
  } = options;

  // Générer une clé de cache unique basée sur les options
  const cacheKey = `${PRODUCT_CACHE_KEY}-${JSON.stringify(options)}`;

  // Vérifier le cache avec une durée de validité plus longue pour les requêtes sans recherche
  const cacheDuration = search ? CACHE_DURATION : CACHE_DURATION * 2;
  const cachedProducts = cache.get<Product[]>(cacheKey);
  if (cachedProducts) {
    return cachedProducts;
  }

  // Sélectionner uniquement les colonnes nécessaires
  let query = supabase
    .from("products")
    .select("id, title, description, price, category, pdf_path, created_at");

  // Filtres
  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    const searchTerm = search.toLowerCase().trim();
    if (searchTerm) {
      query = query.or(`title.ilike.*${searchTerm}*,description.ilike.*${searchTerm}*,category.ilike.*${searchTerm}*`);
    }
  }

  if (minPrice !== null) {
    query = query.gte("price", minPrice);
  }

  if (maxPrice !== null) {
    query = query.lte("price", maxPrice);
  }

  // Optimiser le tri en utilisant les index
  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("created_at", { ascending: false }); // Fallback sur la date de création
      break;
    default: // newest
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw error;
  }

  // Mettre en cache les résultats avec une durée adaptée
  if (data) {
    cache.set(cacheKey, data, cacheDuration);
  }

  return data || [];
}

export async function getProduct(id: string) {
  // Vérifier le cache pour un produit spécifique
  const cacheKey = `${PRODUCT_CACHE_KEY}-${id}`;
  const cachedProduct = cache.get<Product>(cacheKey);
  if (cachedProduct) {
    return cachedProduct;
  }

  // Sélectionner uniquement les colonnes nécessaires
  const { data, error } = await supabase
    .from("products")
    .select("id, title, description, price, category, image, pdf_path, created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    throw error;
  }

  if (data) {
    // Cache plus long pour les produits individuels
    cache.set(cacheKey, data, CACHE_DURATION * 4);
  }

  return data;
}

export async function createOrder(userId: string, items: any[]) {
  try {
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    // Créer la commande dans une transaction
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Ajouter les produits à la commande
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getDownloadUrl(productId: string, orderId: string) {
  try {
    // Vérifier que l'utilisateur a bien acheté le produit
    const { data: orderItem, error: orderError } = (await supabase
      .from("order_items")
      .select("products(pdf_path), download_count")
      .eq("product_id", productId)
      .eq("order_id", orderId)
      .single()) as { data: OrderItem | null; error: any };

    if (orderError) throw orderError;
    if (!orderItem) throw new Error("Order item not found");

    // Vérifier la limite de téléchargements (max 3)
    if (orderItem.download_count >= 3) {
      throw new Error("Limite de téléchargements atteinte");
    }

    // Générer une URL signée pour le téléchargement
    const {
      data: { signedUrl },
      error: signedError,
    } = await supabase.storage
      .from("pdfs")
      .createSignedUrl(orderItem.products.pdf_path, 3600); // URL valide 1 heure

    if (signedError) throw signedError;

    // Incrémenter le compteur de téléchargements
    await supabase
      .from("order_items")
      .update({ download_count: orderItem.download_count + 1 })
      .eq("product_id", productId)
      .eq("order_id", orderId);

    return signedUrl;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw error;
  }
}
