// Composant d'édition d'articles avec TipTap
// src/components/admin/PostEditor.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { ImageUploadServiceEnhanced } from "../../lib/image-upload-service-enhanced";
import { PostsService } from "../../lib/posts-service.js";
import ImageUploadEnhanced from "../ui/ImageUploadEnhanced.jsx";
import { BLOG_CATEGORIES } from "../../lib/constants.js";
import "../../styles/tiptap-editor.css";
// Pas d'imports de types dans les composants JSX

// Configuration des extensions TipTap
const extensions = [
  StarterKit.configure({
    heading: false, // On utilise notre extension Heading personnalisée
    link: false, // Désactiver l'extension Link du StarterKit pour éviter les doublons
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-sage hover:text-sage-600 underline",
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: "max-w-full h-auto rounded-lg shadow-md",
    },
  }),
  Placeholder.configure({
    placeholder: "Commencez à écrire votre article...",
  }),
  Heading.configure({
    levels: [1, 2, 3],
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right"],
  }),
  CharacterCount.configure({
    limit: 10000,
  }),
  Typography,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
];

// Composant de la barre d'outils
const Toolbar = ({
  editor,
  onImageUpload,
  onSave,
  onPublish,
  isSaving,
  isPublished,
}) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const setImage = async (imageUrl) => {
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: "Image du blog",
          title: "Image du blog",
        })
        .run();
    }
  };

  if (!editor) {
    console.log("Barre d'outils: Éditeur non disponible");
    return (
      <div className="border-b border-gray-200 bg-white p-4">
        Chargement de l'éditeur...
      </div>
    );
  }

  console.log("Barre d'outils: Éditeur disponible, rendu de la barre d'outils");

  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-sage/10 to-gold/10 p-4 sticky top-0 z-10 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {/* Titres */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              console.log("Bouton H1 cliqué");
              if (editor) {
                console.log("Éditeur disponible, exécution de la commande H1");
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              } else {
                console.error("Éditeur non disponible");
              }
            }}
            className={`p-2 rounded ${editor?.isActive("heading", { level: 1 }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Titre H1"
          >
            H1
          </button>
          <button
            onClick={() => {
              console.log("Bouton H2 cliqué");
              if (editor) {
                console.log("Éditeur disponible, exécution de la commande H2");
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              } else {
                console.error("Éditeur non disponible");
              }
            }}
            className={`p-2 rounded ${editor?.isActive("heading", { level: 2 }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Titre H2"
          >
            H2
          </button>
          <button
            onClick={() => {
              console.log("Bouton H3 cliqué");
              if (editor) {
                console.log("Éditeur disponible, exécution de la commande H3");
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              } else {
                console.error("Éditeur non disponible");
              }
            }}
            className={`p-2 rounded ${editor?.isActive("heading", { level: 3 }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Titre H3"
          >
            H3
          </button>
        </div>

        {/* Formatage de texte */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              console.log("Bouton Gras cliqué");
              if (editor) {
                console.log(
                  "Éditeur disponible, exécution de la commande Gras"
                );
                editor.chain().focus().toggleBold().run();
              } else {
                console.error("Éditeur non disponible");
              }
            }}
            className={`p-2 rounded ${editor?.isActive("bold") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Gras"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => {
              console.log("Bouton Italique cliqué");
              if (editor) {
                console.log(
                  "Éditeur disponible, exécution de la commande Italique"
                );
                editor.chain().focus().toggleItalic().run();
              } else {
                console.error("Éditeur non disponible");
              }
            }}
            className={`p-2 rounded ${editor?.isActive("italic") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Italique"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => {
              console.log("Bouton Souligné cliqué");
              if (editor) {
                console.log(
                  "Éditeur disponible, exécution de la commande Souligné"
                );
                editor.chain().focus().toggleUnderline().run();
              } else {
                console.error("Éditeur non disponible");
              }
            }}
            className={`p-2 rounded ${editor?.isActive("underline") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Souligné"
          >
            <u>U</u>
          </button>
        </div>

        {/* Listes */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${editor.isActive("bulletList") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Liste à puces"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${editor.isActive("orderedList") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Liste numérotée"
          >
            1.
          </button>
        </div>

        {/* Citation */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${editor.isActive("blockquote") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          title="Citation"
        >
          "
        </button>

        {/* Alignement */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Aligner à gauche"
          >
            ←
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Centrer"
          >
            ↔
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Aligner à droite"
          >
            →
          </button>
        </div>

        {/* Lien */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-2 rounded ${editor.isActive("link") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            title="Ajouter un lien"
          >
            🔗
          </button>
          {editor.isActive("link") && (
            <button
              onClick={removeLink}
              className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-700"
              title="Supprimer le lien"
            >
              ✕
            </button>
          )}
        </div>

        {/* Upload d'image avec conversion WebP */}
        <div className="flex items-center space-x-1">
          <ImageUploadEnhanced
            onImageUploaded={setImage}
            className="inline-block"
            showCompressionStats={false}
            autoConvertToWebP={true}
          />
        </div>

        {/* Séparateur */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => {
              console.log("Bouton Brouillon cliqué !");
              // Appeler directement handleSave au lieu de onSave
              if (typeof window.handleSave === "function") {
                console.log("Appel de handleSave via window...");
                window.handleSave();
              } else {
                console.log("handleSave n'est pas disponible sur window");
              }
            }}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isSaving ? "Sauvegarde..." : "Brouillon"}
          </button>

          {!isPublished && (
            <button
              onClick={onPublish}
              className="px-4 py-2 bg-sage text-white rounded hover:bg-sage-600"
            >
              Publier
            </button>
          )}
        </div>
      </div>

      {/* Input pour les liens */}
      {showLinkInput && (
        <div className="mt-3 flex items-center space-x-2">
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
            onKeyPress={(e) => e.key === "Enter" && addLink()}
          />
          <button
            onClick={addLink}
            className="px-3 py-2 bg-sage text-white rounded hover:bg-sage-600"
          >
            Ajouter
          </button>
          <button
            onClick={() => setShowLinkInput(false)}
            className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

// Composant principal PostEditor
const PostEditor = ({
  initialData = null,
  postId,
  userId,
  onSave,
  onPublish,
}) => {
  console.log("PostEditor - Props reçues:", {
    hasInitialData: !!initialData,
    postId,
    userId,
    hasOnSave: !!onSave,
    hasOnPublish: !!onPublish,
    onSaveType: typeof onSave,
    onPublishType: typeof onPublish,
  });
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url || "");
  const [coverAlt, setCoverAlt] = useState(initialData?.cover_alt || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo_description || ""
  );
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(
    initialData?.status === "published"
  );

  // Initialiser l'éditeur TipTap
  const editor = useEditor({
    extensions,
    content: initialData?.content || {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: " ",
            },
          ],
        },
      ],
    },
    immediatelyRender: false, // Éviter les problèmes d'hydratation SSR
    onUpdate: ({ editor }) => {
      // Auto-save optionnel ici
    },
    onCreate: ({ editor }) => {
      console.log("Éditeur TipTap créé avec succès");
      console.log(
        "Extensions chargées:",
        editor.extensionManager.extensions.map((ext) => ext.name)
      );
    },
    onDestroy: () => {
      console.log("Éditeur TipTap détruit");
    },
  });

  // Log de l'état de l'éditeur
  useEffect(() => {
    console.log("État de l'éditeur:", {
      isEditorReady: !!editor,
      hasExtensions: editor?.extensionManager?.extensions?.length > 0,
      extensions:
        editor?.extensionManager?.extensions?.map((ext) => ext.name) || [],
    });
  }, [editor]);

  // Sauvegarder automatiquement le contenu
  const handleSave = useCallback(async () => {
    console.log("handleSave appelé");
    console.log("Éditeur disponible:", !!editor);
    console.log("Titre:", title);

    if (!editor || !title.trim()) {
      console.log("Validation échouée: éditeur ou titre manquant");
      return;
    }

    console.log("Validation réussie, début de la sauvegarde");
    setIsSaving(true);

    try {
      console.log("Préparation des données...");
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        cover_url: coverUrl.trim() || null,
        cover_alt: coverAlt.trim() || null,
        content: editor.getJSON(),
        category: category.trim() || null,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        // Ne pas inclure le statut pour préserver l'état actuel
        // status: status, // Commenté pour préserver le statut existant
      };

      console.log("PostData préparé:", postData);
      console.log("onSave disponible:", !!onSave);

      if (onSave) {
        console.log("Appel de onSave avec postData...");
        await onSave(postData);
        console.log("onSave terminé avec succès");
      } else {
        console.log(
          "onSave n'est pas disponible, utilisation de l'événement personnalisé..."
        );
        // Fallback : utiliser un événement personnalisé
        const event = new CustomEvent("postSave", {
          detail: {
            postData,
            action: "save",
          },
        });
        console.log("Événement postSave créé:", event);
        window.dispatchEvent(event);
        console.log("Événement postSave dispatché");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      console.log("Fin de handleSave, setIsSaving(false)");
      setIsSaving(false);
    }
  }, [
    editor,
    title,
    excerpt,
    coverUrl,
    coverAlt,
    tags,
    category,
    seoTitle,
    seoDescription,
    onSave,
  ]);

  // Publier l'article
  const handlePublish = useCallback(async () => {
    console.log("handlePublish appelé");

    // Validation complète des données
    const validationErrors = [];

    if (!editor) {
      validationErrors.push("L'éditeur n'est pas initialisé");
    }

    if (!title.trim()) {
      validationErrors.push("Le titre est requis");
    }

    if (!category.trim()) {
      validationErrors.push("La catégorie est requise");
    }

    if (validationErrors.length > 0) {
      console.log("Validation échouée:", validationErrors);
      alert("Erreurs de validation:\n" + validationErrors.join("\n"));
      return;
    }

    console.log("Validation réussie");

    const postData = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      cover_url: coverUrl.trim() || null,
      cover_alt: coverAlt.trim() || null,
      content: editor.getJSON(),
      category: category.trim() || null,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      status: "published",
    };

    console.log("PostData préparé:", postData);
    console.log("onPublish disponible:", !!onPublish);

    // Essayer d'abord le callback direct
    if (onPublish) {
      console.log("Appel de onPublish via callback...");
      try {
        await onPublish(postData);
        return;
      } catch (error) {
        console.error("Erreur avec callback direct:", error);
      }
    }

    // Fallback : utiliser un événement personnalisé
    console.log("Utilisation de l'événement personnalisé...");
    const event = new CustomEvent("postPublish", {
      detail: {
        postData,
        action: "publish",
      },
    });
    console.log("Événement créé:", event);
    console.log("Dispatch de l'événement...");
    window.dispatchEvent(event);
    console.log("Événement dispatché");

    // Solution de contournement : appel direct de l'API
    console.log("Tentative d'appel direct de l'API...");
    try {
      // Déterminer si c'est une création ou une édition
      const isEditMode = postId && postId !== "new";
      const apiEndpoint = isEditMode
        ? `/api/posts/${postId}`
        : "/api/posts/create";
      const method = isEditMode ? "PUT" : "POST";

      console.log("Mode:", isEditMode ? "Édition" : "Création");
      console.log("Endpoint:", apiEndpoint);
      console.log("Méthode:", method);

      const response = await fetch(apiEndpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...postData,
          author_id: userId,
        }),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(
          `Erreur ${response.status}: ${responseData.error || "Erreur inconnue"}`
        );
      }

      alert("Article publié avec succès !");
      setIsPublished(true);
      // Rediriger vers la liste des articles
      window.location.href = "/admin/blog";
    } catch (error) {
      console.error("Erreur lors de l'appel direct de l'API:", error);
      alert("Une erreur est survenue lors de la publication: " + error.message);
    }
  }, [
    editor,
    title,
    excerpt,
    coverUrl,
    coverAlt,
    tags,
    category,
    seoTitle,
    seoDescription,
    onPublish,
    postId,
    userId,
  ]);

  // Rendre handleSave accessible globalement pour le bouton
  useEffect(() => {
    window.handleSave = handleSave;
    return () => {
      delete window.handleSave;
    };
  }, [handleSave]);

  // Auto-save avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(handleSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [
    title,
    excerpt,
    coverUrl,
    coverAlt,
    tags,
    category,
    seoTitle,
    seoDescription,
  ]);

  if (!editor) return <div>Chargement de l'éditeur...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Formulaire des métadonnées */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Titre */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'article *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Titre de votre article..."
              required
            />
          </div>

          {/* Extrait */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extrait
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Résumé de votre article..."
            />
          </div>

          {/* Image de couverture */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture
            </label>
            <ImageUploadEnhanced
              onImageUploaded={(url) => setCoverUrl(url)}
              onRemoveImage={() => setCoverUrl("")}
              className="w-full"
              showCompressionStats={true}
              autoConvertToWebP={true}
            />
          </div>

          {/* Alt de l'image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte alternatif
            </label>
            <input
              type="text"
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Description de l'image..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="tag1, tag2, tag3..."
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>

          {/* SEO Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre SEO
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Titre pour les moteurs de recherche..."
            />
          </div>

          {/* SEO Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description SEO
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Description pour les moteurs de recherche..."
            />
          </div>
        </div>
      </div>

      {/* Barre d'outils */}
      <Toolbar
        editor={editor}
        onImageUpload={() => {}}
        onSave={handleSave}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublished={isPublished}
      />

      {/* Éditeur de contenu */}
      <div className="p-6 bg-gradient-to-br from-sage/5 to-gold/5 rounded-lg">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            📝 Zone d'édition de l'article
          </h3>
          <p className="text-sm text-gray-600">
            Utilisez la barre d'outils ci-dessus pour formater votre texte
          </p>
        </div>

        <EditorContent
          editor={editor}
          className="prose prose-lg max-w-none tip-tap-editor"
        />

        {/* Compteur de caractères */}
        <div className="mt-4 text-sm text-gray-500 text-right">
          {editor.storage.characterCount.characters()} caractères
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
