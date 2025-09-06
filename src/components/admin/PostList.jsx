// Composant de gestion de la liste des articles
// src/components/admin/PostList.jsx

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase-client.js";
// Pas d'imports de types dans les composants JSX

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 10,
  });

  // Fonctions de gestion directes
  const handleEditPost = (post) => {
    console.log("handleEditPost appelé pour:", post);
    // Rediriger vers la page d'édition
    window.location.href = `/admin/post/${post.id}`;
  };

  const handleDeletePost = async (postId) => {
    console.log("handleDeletePost appelé pour:", postId);
    try {
      console.log("Envoi de la requête DELETE vers:", `/api/posts/${postId}`);
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      console.log("Réponse reçue:", response.status, response.statusText);

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      alert("Article supprimé avec succès");

      // Recharger directement les données au lieu de recharger la page
      await loadPosts();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  const handlePublishPost = async (postId) => {
    console.log("handlePublishPost appelé pour:", postId);
    try {
      const response = await fetch(`/api/posts/${postId}/publish`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Erreur lors de la publication");

      alert("Article publié avec succès");
      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la publication");
    }
  };

  const handleUnpublishPost = async (postId) => {
    console.log("handleUnpublishPost appelé pour:", postId);
    try {
      const response = await fetch(`/api/posts/${postId}/unpublish`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Erreur lors de la mise en brouillon");

      alert("Article mis en brouillon");
      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la mise en brouillon");
    }
  };

  // Charger les articles
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer tous les articles (pour l'admin, on affiche tous les articles)
      console.log("Chargement des articles depuis Supabase...");

      // Forcer un cache-busting en ajoutant un timestamp
      const timestamp = Date.now();
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement:", error);
        setError("Erreur lors du chargement des articles: " + error.message);
      } else {
        console.log("Articles récupérés:", posts?.length || 0, "articles");
        console.log("IDs des articles:", posts?.map((p) => p.id) || []);
        setPosts(posts || []);
      }
    } catch (err) {
      setError("Erreur lors du chargement des articles: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les articles au montage et quand les filtres changent
  useEffect(() => {
    loadPosts();
  }, [filters]);

  // Les fonctions de gestion sont maintenant passées via les props depuis Astro

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Non publié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: "Brouillon", class: "bg-gray-100 text-gray-800" },
      published: { label: "Publié", class: "bg-green-100 text-green-800" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage"></div>
        <span className="ml-2 text-gray-600">Chargement des articles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-4">
              <button
                onClick={loadPosts}
                className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
      {/* Filtres */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher dans les articles..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </div>

          {/* Filtre par statut */}
          <div className="sm:w-48">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                  page: 1,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillons</option>
              <option value="published">Publiés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des articles */}
      <div className="overflow-x-auto">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun article trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.status
                ? "Essayez de modifier vos filtres."
                : "Commencez par créer votre premier article."}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Article
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.cover_url && (
                        <img
                          src={post.cover_url}
                          alt={post.cover_alt || post.title}
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p className="text-sm text-gray-500 truncate">
                            {post.excerpt}
                          </p>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>Côté: {formatDate(post.created_at)}</div>
                      {post.published_at && (
                        <div>Publié: {formatDate(post.published_at)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-sage hover:text-sage-600"
                        title="Modifier"
                      >
                        ✏️
                      </button>

                      {post.status === "draft" ? (
                        <button
                          onClick={() => handlePublishPost(post.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Publier"
                        >
                          📤
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublishPost(post.id)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Mettre en brouillon"
                        >
                          📥
                        </button>
                      )}

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PostList;
