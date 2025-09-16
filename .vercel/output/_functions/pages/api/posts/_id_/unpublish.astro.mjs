import { s as supabase$1 } from '../../../../chunks/supabase_CXSvBnpz.mjs';
import { s as supabase } from '../../../../chunks/supabase-client_DdgYuUwa.mjs';
export { renderers } from '../../../../renderers.mjs';

// Service pour la gestion des articles avec TipTap (version JavaScript)
// src/lib/posts-service.js


class PostsService {
  /**
   * Récupérer tous les articles publiés
   */
  static async getPublishedPosts(limit = 10, offset = 0) {
    try {
      const {
        data: posts,
        error,
        count,
      } = await supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        success: true,
        data: {
          posts: posts || [],
          total: count || 0,
          page: Math.floor(offset / limit) + 1,
          limit,
          hasMore: (count || 0) > offset + limit,
        },
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des articles publiés:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Récupérer un article par son slug
   */
  static async getPostBySlug(slug) {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;

      return {
        success: true,
        data: post,
      };
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'article ${slug}:`,
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Récupérer un article par son ID (pour l'édition)
   */
  static async getPostById(id) {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: post,
      };
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'article ${id}:`,
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Créer un nouvel article
   */
  static async createPost(postData) {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .insert(postData)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: post,
      };
    } catch (error) {
      console.error("Erreur lors de la création de l'article:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Mettre à jour un article
   */
  static async updatePost(id, updateData) {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: post,
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Supprimer un article
   */
  static async deletePost(id) {
    try {
      console.log("PostsService.deletePost appelé pour l'ID:", id);
      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) {
        console.error("Erreur Supabase lors de la suppression:", error);
        throw error;
      }

      console.log("Article supprimé avec succès de la base de données");
      return {
        success: true,
      };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Publier un article
   */
  static async publishPost(id) {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: post,
      };
    } catch (error) {
      console.error("Erreur lors de la publication de l'article:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Mettre en brouillon un article
   */
  static async unpublishPost(id) {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .update({
          status: "draft",
          published_at: null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: post,
      };
    } catch (error) {
      console.error("Erreur lors de la mise en brouillon de l'article:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Générer un slug unique
   */
  static async generateSlug(title, excludeId = null) {
    try {
      const { data, error } = await supabase.rpc("generate_unique_slug", {
        title_param: title,
        exclude_id_param: excludeId,
      });

      if (error) throw error;

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erreur lors de la génération du slug:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}

const POST = async ({ params, locals }) => {
  try {
    const session = locals.session;
    if (!session?.user?.id) {
      return new Response(JSON.stringify({
        success: false,
        error: "Non authentifié"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "ID de l'article requis"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: existingPost, error: fetchError } = await supabase$1.from("posts").select("author_id, status").eq("id", id).single();
    if (fetchError || !existingPost) {
      return new Response(JSON.stringify({
        success: false,
        error: "Article non trouvé"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (existingPost.author_id !== session.user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: "Non autorisé"
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (existingPost.status === "draft") {
      return new Response(JSON.stringify({
        success: false,
        error: "L'article est déjà en brouillon"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const response = await PostsService.unpublishPost(id);
    if (response.success) {
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Erreur lors de la mise en brouillon de l'article:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Erreur interne du serveur"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
