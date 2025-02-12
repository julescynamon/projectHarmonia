import { supabase } from "./supabase";
import { supabase as adminClient } from "./supabase/service-role";
import { cache } from "./cache";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PRODUCT_CACHE_KEY = "products";

export interface Product {
  id: string; // UUID stored as string in TypeScript
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
  // Validation des paramètres
  const {
    category = null,
    search = null,
    sort = "newest",
    minPrice = null,
    maxPrice = null,
  } = options;

  // Validation des prix
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    throw new Error('Le prix minimum ne peut pas être supérieur au prix maximum');
  }

  if (minPrice !== null && minPrice < 0) {
    throw new Error('Le prix minimum ne peut pas être négatif');
  }

  // Validation du tri
  const validSorts = ['newest', 'price-asc', 'price-desc', 'popular'];
  if (!validSorts.includes(sort)) {
    throw new Error('Option de tri invalide');
  }

  // Générer une clé de cache unique basée sur les options
  const cacheKey = `${PRODUCT_CACHE_KEY}-${JSON.stringify(options)}`;

  // Ajuster la durée du cache en fonction du type de requête
  const isVolatileQuery = search || minPrice !== null || maxPrice !== null;
  const cacheDuration = isVolatileQuery ? CACHE_DURATION : CACHE_DURATION * 4;

  // Vérifier le cache
  const cachedProducts = cache.get<Product[]>(cacheKey);
  if (cachedProducts) {
    return cachedProducts;
  }

  // Construire la requête de base
  let query = supabase
    .from("products")
    .select("id, title, description, price, category, pdf_path, created_at");

  // Appliquer les filtres
  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    const searchTerm = search.trim();
    if (searchTerm) {
      // Utiliser l'index de recherche plein texte
      query = query.textSearch('search_vector', searchTerm, {
        config: 'french',
        type: 'plain'
      });
    }
  }

  // Appliquer les filtres de prix
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
      // Utiliser un score de popularité basé sur la recherche si disponible
      if (search) {
        query = query.order('search_vector', { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }
      break;
    default: // newest
      query = query.order("created_at", { ascending: false });
  }

  try {
    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      throw error;
    }

    // Post-traitement des résultats
    const products = data || [];

    // Tri supplémentaire pour la popularité si nécessaire
    if (sort === 'popular' && !search) {
      products.sort((a, b) => {
        // Ici vous pouvez ajouter une logique personnalisée de popularité
        // Par exemple, basée sur le nombre de ventes, vues, etc.
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    // Mettre en cache les résultats
    if (products.length > 0) {
      cache.set(cacheKey, products, cacheDuration);
    }

    return products;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw new Error(
      'Une erreur est survenue lors de la récupération des produits. ' +
      'Veuillez réessayer plus tard.'
    );
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!id) {
    console.error('ID du produit manquant');
    return null;
  }

  // Vérifier le cache pour un produit spécifique
  const cacheKey = `${PRODUCT_CACHE_KEY}-${id}`;
  const cachedProduct = cache.get<Product>(cacheKey);
  if (cachedProduct) {
    return cachedProduct;
  }

  try {
    // Sélectionner uniquement les colonnes nécessaires
    const { data, error } = await supabase
      .from("products")
      .select("id, title, description, price, category, pdf_path, created_at")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      return null;
    }

    if (data) {
      // Cache plus long pour les produits individuels
      cache.set(cacheKey, data, CACHE_DURATION * 4);
      return data;
    }

    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return null;
  }
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

export async function getDownloadUrl(productId: string, orderId: string, userId: string): Promise<string | null> {
  console.log('Génération URL de téléchargement:', { productId, orderId, userId });

  try {

    // Vérifier que le produit existe et récupérer son chemin PDF
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('pdf_path')
      .eq('id', productId)
      .single();

    if (productError || !product || !product.pdf_path) {
      console.error('Erreur ou produit non trouvé:', productError);
      return null;
    }

    console.log('Produit trouvé:', product);

    // Vérifier que l'utilisateur a bien acheté ce produit
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        order_items!inner (id, product_id, download_count)
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    console.log('Résultat vérification commande:', { order, error: orderError });
    if (orderError || !order) {
      console.error('Erreur de vérification de la commande:', orderError);
      return null;
    }

    // Vérifier que le produit fait partie de la commande
    const hasProduct = order.order_items.some(item => item.product_id === productId);
    if (!hasProduct) {
      console.error('Le produit ne fait pas partie de la commande');
      return null;
    }

    // Vérifier que le bucket existe
    const { data: buckets } = await adminClient
      .storage
      .listBuckets();
    
    console.log('Buckets disponibles:', buckets);

    // Lister les fichiers dans le bucket
    const { data: files, error: listError } = await adminClient
      .storage
      .from('pdfs')
      .list();

    console.log('Fichiers dans le bucket pdfs:', files);
    if (listError) {
      console.error('Erreur lors de la liste des fichiers:', listError);
    }

    // Générer l'URL de téléchargement
    console.log('Tentative de génération URL signée pour:', product.pdf_path);
    const { data: signedUrl, error: signedUrlError } = await adminClient
      .storage
      .from('pdfs')
      .createSignedUrl(product.pdf_path, 300); // URL valide 5 minutes

    if (signedUrlError) {
      console.error('Erreur lors de la génération de l\'URL signée:', signedUrlError);
      return null;
    }

    // Incrémenter le compteur de téléchargements
    const { error: updateError } = await supabase
      .from('order_items')
      .update({ download_count: (order.order_items[0].download_count || 0) + 1 })
      .eq('order_id', orderId)
      .eq('product_id', productId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour du compteur:', updateError);
      // On continue quand même, ce n'est pas bloquant
    }

    console.log('URL signée générée:', signedUrl);
    return signedUrl?.signedUrl || null;
  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL:', error);
    return null;
  }
}

// Fonctions de gestion du panier
export interface CartItem {
  id: string; // UUID
  user_id: string; // UUID
  product_id: string; // UUID
  quantity: number;
  created_at: string;
  product: Product;
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products (
        id,
        title,
        description,
        price,
        category
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    throw error;
  }

  return data || [];
}

export async function getCartItemCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  if (error) {
    console.error('Erreur lors du comptage des articles:', error);
    throw error;
  }

  return count || 0;
}
