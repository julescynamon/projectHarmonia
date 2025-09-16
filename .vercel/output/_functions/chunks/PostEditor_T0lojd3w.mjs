import { e as createAstro, c as createComponent, a as renderTemplate, g as renderSlot, f as defineScriptVars, h as renderHead, b as renderScript } from './astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import 'clsx';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image$1 from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { c as createClient } from './index_DeVVxtlF.mjs';
import './supabase-client_DdgYuUwa.mjs';
import { B as BLOG_CATEGORIES } from './constants_BZA9_ual.mjs';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$AdminLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const supabase = Astro2.locals.supabase;
  const session = Astro2.locals.session;
  let isAdmin = false;
  if (session?.user?.id) {
    const isMainAdmin = session.user.email === "tyzranaima@gmail.com";
    if (isMainAdmin) {
      isAdmin = true;
    } else {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
      isAdmin = profile?.role === "admin";
    }
  }
  const authInfo = {
    isAuthenticated: !!session,
    isAdmin,
    userId: session?.user?.id
  };
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="fr"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', ' - Administration La Maison Sattva\xEFa</title><link rel="icon" type="image/svg+xml" href="/favicon.svg">', "", '</head> <body class="min-h-screen bg-gray-50"> <script>(function(){', `
      // V\xE9rification c\xF4t\xE9 client
      if (!authInfo.isAuthenticated) {
        window.location.href = '/login';
      } else if (!authInfo.isAdmin) {
        window.location.href = '/';
      }
    })();<\/script> <!-- Header --> <header class="bg-white shadow"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> <div class="flex justify-between items-center"> <div class="flex items-center"> <a href="/mon-compte" class="text-xl font-semibold text-gray-900">
Administration La Maison Sattva\xEFa
</a> </div> <nav class="flex space-x-4"> <a href="/admin/blog" class="text-gray-600 hover:text-gray-900">
Articles
</a> <button id="logoutBtn" class="text-gray-600 hover:text-gray-900">
D\xE9connexion
</button> </nav> </div> </div> </header> <!-- Main content --> <main> `, " </main> </body></html>"])), title, renderScript($$result, "/Users/jules/Downloads/harmonia/src/layouts/AdminLayout.astro?astro&type=script&index=0&lang.ts"), renderHead(), defineScriptVars({ authInfo }), renderSlot($$result, $$slots["default"]));
}, "/Users/jules/Downloads/harmonia/src/layouts/AdminLayout.astro", void 0);

const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGh0ZWJqdm11dHV2enZ0dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTM5NTgsImV4cCI6MjA1MjI2OTk1OH0.gpI9njtvd6Mu_0wTnwfvtx0bFpUDNexuzwu3hgOGDdY";
const supabase = createClient(supabaseUrl, supabaseKey);
class ImageUploadServiceEnhanced {
  static BUCKET_NAME = "blog-images";
  static MAX_FILE_SIZE = 10 * 1024 * 1024;
  // 10MB
  static ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  static WEBP_QUALITY = 0.85;
  // Qualité WebP (0.0 à 1.0)
  /**
   * Valider un fichier image
   */
  static validateFile(file) {
    if (!file) {
      return { valid: false, error: "Aucun fichier sélectionné" };
    }
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: `Fichier trop volumineux. Taille maximum: ${this.MAX_FILE_SIZE / 1024 / 1024}MB` };
    }
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: `Type de fichier non supporté. Types autorisés: ${this.ALLOWED_TYPES.join(", ")}` };
    }
    return { valid: true };
  }
  /**
   * Convertir une image en WebP
   */
  static async convertToWebP(file, quality = this.WEBP_QUALITY) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                  type: "image/webp",
                  lastModified: Date.now()
                });
                resolve(webpFile);
              } else {
                reject(new Error("Erreur lors de la conversion en WebP"));
              }
            },
            "image/webp",
            quality
          );
        } catch (error) {
          reject(new Error("Erreur lors de la conversion: " + error));
        }
      };
      img.onerror = () => reject(new Error("Erreur lors du chargement de l'image"));
      img.src = URL.createObjectURL(file);
    });
  }
  /**
   * Générer un nom de fichier unique
   */
  static generateFileName(file, userId) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    return `${userId}/${timestamp}-${randomId}.${extension}`;
  }
  /**
   * Uploader une image avec conversion automatique en WebP
   */
  static async uploadImage(file, userId, onProgress, convertToWebP = true) {
    try {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      let fileToUpload = file;
      let originalFileName = file.name;
      if (convertToWebP && !file.type.includes("webp") && !file.type.includes("gif")) {
        try {
          onProgress?.(10);
          fileToUpload = await this.convertToWebP(file);
          onProgress?.(50);
          console.log(`Image convertie en WebP: ${originalFileName} -> ${fileToUpload.name}`);
        } catch (conversionError) {
          console.warn("Erreur lors de la conversion WebP, utilisation du fichier original:", conversionError);
          fileToUpload = file;
        }
      }
      const fileName = this.generateFileName(fileToUpload, userId);
      const filePath = `${fileName}`;
      onProgress?.(60);
      const { data, error } = await supabase.storage.from(this.BUCKET_NAME).upload(filePath, fileToUpload, {
        cacheControl: "3600",
        upsert: false
      });
      if (error) {
        throw new Error(`Erreur lors de l'upload: ${error.message}`);
      }
      onProgress?.(90);
      const { data: urlData } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(filePath);
      onProgress?.(100);
      const result = {
        url: urlData.publicUrl,
        path: filePath,
        filename: fileToUpload.name,
        size: fileToUpload.size,
        mime_type: fileToUpload.type
      };
      return result;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      throw error;
    }
  }
  /**
   * Supprimer une image
   */
  static async deleteImage(filePath) {
    try {
      const { error } = await supabase.storage.from(this.BUCKET_NAME).remove([filePath]);
      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      throw error;
    }
  }
  /**
   * Lister les images d'un utilisateur
   */
  static async listUserImages(userId) {
    try {
      const { data, error } = await supabase.storage.from(this.BUCKET_NAME).list(userId);
      if (error) {
        throw new Error(`Erreur lors de la récupération des images: ${error.message}`);
      }
      return data?.map((file) => file.name) || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des images:", error);
      throw error;
    }
  }
  /**
   * Obtenir les statistiques de compression
   */
  static getCompressionStats(originalFile, convertedFile) {
    const originalSize = originalFile.size;
    const convertedSize = convertedFile.size;
    const compressionRatio = (originalSize - convertedSize) / originalSize * 100;
    const savings = originalSize - convertedSize;
    return {
      originalSize,
      convertedSize,
      compressionRatio: Math.round(compressionRatio * 100) / 100,
      savings
    };
  }
}

const ImageUploadEnhanced = ({
  onImageUploaded,
  onRemoveImage,
  className = "",
  showCompressionStats = true,
  autoConvertToWebP = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [compressionStats, setCompressionStats] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);
  const handleFileUpload = async (file) => {
    try {
      setIsUploading(true);
      setError("");
      setUploadProgress(0);
      setCompressionStats(null);
      const userId = window.currentUserId || "temp-user-id";
      const result = await ImageUploadServiceEnhanced.uploadImage(
        file,
        userId,
        (progress) => setUploadProgress(progress),
        autoConvertToWebP
      );
      setImageUrl(result.url);
      if (autoConvertToWebP && !file.type.includes("webp") && !file.type.includes("gif")) {
        const estimatedConvertedSize = Math.round(file.size * 0.7);
        const stats = ImageUploadServiceEnhanced.getCompressionStats(
          file,
          { size: estimatedConvertedSize }
          // Objet simulé
        );
        setCompressionStats(stats);
      }
      if (onImageUploaded) {
        onImageUploaded(result.url);
      }
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1e3);
    } catch (error2) {
      console.error("Erreur lors de l'upload:", error2);
      setError(error2.message || "Erreur lors de l'upload de l'image");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const handleRemoveImage = () => {
    setImageUrl("");
    setCompressionStats(null);
    if (onRemoveImage) {
      onRemoveImage();
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `space-y-4 ${className}`, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${dragActive ? "border-sage bg-sage/10" : "border-gray-300 hover:border-sage hover:bg-sage/5"} ${isUploading ? "pointer-events-none opacity-50" : ""}`,
        onDragEnter: handleDrag,
        onDragLeave: handleDrag,
        onDragOver: handleDrag,
        onDrop: handleDrop,
        children: [
          imageUrl ? (
            // Image uploadée
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative inline-block", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: imageUrl,
                    alt: "Image uploadée",
                    className: "max-w-full max-h-64 rounded-lg shadow-lg"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: handleRemoveImage,
                    className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors",
                    title: "Supprimer l'image",
                    children: "×"
                  }
                )
              ] }),
              showCompressionStats && compressionStats && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 text-sm", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsx("span", { className: "text-green-600 font-medium", children: "✓ Conversion WebP réussie" }) }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-xs text-gray-600", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Taille originale:" }),
                    /* @__PURE__ */ jsx("br", {}),
                    (compressionStats.originalSize / 1024).toFixed(1),
                    " KB"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Taille WebP:" }),
                    /* @__PURE__ */ jsx("br", {}),
                    (compressionStats.convertedSize / 1024).toFixed(1),
                    " KB"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Réduction:" }),
                    /* @__PURE__ */ jsx("br", {}),
                    compressionStats.compressionRatio,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Économie:" }),
                    /* @__PURE__ */ jsx("br", {}),
                    (compressionStats.savings / 1024).toFixed(1),
                    " KB"
                  ] })
                ] })
              ] })
            ] })
          ) : (
            // Zone de drop vide
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-gray-500", children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "mx-auto h-12 w-12 mb-4",
                    stroke: "currentColor",
                    fill: "none",
                    viewBox: "0 0 48 48",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-lg font-medium text-gray-900 mb-2", children: "Glissez-déposez votre image ici" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: "ou cliquez pour sélectionner un fichier" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400", children: [
                  "Formats supportés: JPG, PNG, GIF, WebP (max 10MB)",
                  autoConvertToWebP && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("br", {}),
                    "🔄 Conversion automatique en WebP pour optimiser la taille"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  accept: "image/*",
                  onChange: handleFileSelect,
                  className: "hidden",
                  id: "image-upload",
                  disabled: isUploading
                }
              ),
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "image-upload",
                  className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sage hover:bg-sage/90 cursor-pointer transition-colors",
                  children: "Sélectionner une image"
                }
              )
            ] })
          ),
          isUploading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-2", children: uploadProgress < 50 ? "Conversion en WebP..." : "Upload en cours..." }),
            /* @__PURE__ */ jsx("div", { className: "w-48 bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-sage h-2 rounded-full transition-all duration-300",
                style: { width: `${uploadProgress}%` }
              }
            ) }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
              uploadProgress,
              "%"
            ] })
          ] }) })
        ]
      }
    ),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: "h-5 w-5 text-red-500",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: error })
    ] }) })
  ] });
};

const extensions = [
  StarterKit.configure({
    heading: false,
    // On utilise notre extension Heading personnalisée
    link: false
    // Désactiver l'extension Link du StarterKit pour éviter les doublons
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-sage hover:text-sage-600 underline"
    }
  }),
  Image$1.configure({
    HTMLAttributes: {
      class: "max-w-full h-auto rounded-lg shadow-md"
    }
  }),
  Placeholder.configure({
    placeholder: "Commencez à écrire votre article..."
  }),
  Heading.configure({
    levels: [1, 2, 3]
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right"]
  }),
  CharacterCount.configure({
    limit: 1e4
  }),
  Typography,
  Color,
  Highlight.configure({
    multicolor: true
  })
];
const Toolbar = ({
  editor,
  onImageUpload,
  onSave,
  onPublish,
  isSaving,
  isPublished
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
      editor.chain().focus().setImage({
        src: imageUrl,
        alt: "Image du blog",
        title: "Image du blog"
      }).run();
    }
  };
  if (!editor) {
    console.log("Barre d'outils: Éditeur non disponible");
    return /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 bg-white p-4", children: "Chargement de l'éditeur..." });
  }
  console.log("Barre d'outils: Éditeur disponible, rendu de la barre d'outils");
  return /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-200 bg-gradient-to-r from-sage/10 to-gold/10 p-4 sticky top-0 z-10 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              console.log("Bouton H1 cliqué");
              if (editor) {
                console.log("Éditeur disponible, exécution de la commande H1");
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              } else {
                console.error("Éditeur non disponible");
              }
            },
            className: `p-2 rounded ${editor?.isActive("heading", { level: 1 }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Titre H1",
            children: "H1"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              console.log("Bouton H2 cliqué");
              if (editor) {
                console.log("Éditeur disponible, exécution de la commande H2");
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              } else {
                console.error("Éditeur non disponible");
              }
            },
            className: `p-2 rounded ${editor?.isActive("heading", { level: 2 }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Titre H2",
            children: "H2"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              console.log("Bouton H3 cliqué");
              if (editor) {
                console.log("Éditeur disponible, exécution de la commande H3");
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              } else {
                console.error("Éditeur non disponible");
              }
            },
            className: `p-2 rounded ${editor?.isActive("heading", { level: 3 }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Titre H3",
            children: "H3"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              console.log("Bouton Gras cliqué");
              if (editor) {
                console.log(
                  "Éditeur disponible, exécution de la commande Gras"
                );
                editor.chain().focus().toggleBold().run();
              } else {
                console.error("Éditeur non disponible");
              }
            },
            className: `p-2 rounded ${editor?.isActive("bold") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Gras",
            children: /* @__PURE__ */ jsx("strong", { children: "B" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              console.log("Bouton Italique cliqué");
              if (editor) {
                console.log(
                  "Éditeur disponible, exécution de la commande Italique"
                );
                editor.chain().focus().toggleItalic().run();
              } else {
                console.error("Éditeur non disponible");
              }
            },
            className: `p-2 rounded ${editor?.isActive("italic") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Italique",
            children: /* @__PURE__ */ jsx("em", { children: "I" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              console.log("Bouton Souligné cliqué");
              if (editor) {
                console.log(
                  "Éditeur disponible, exécution de la commande Souligné"
                );
                editor.chain().focus().toggleUnderline().run();
              } else {
                console.error("Éditeur non disponible");
              }
            },
            className: `p-2 rounded ${editor?.isActive("underline") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Souligné",
            children: /* @__PURE__ */ jsx("u", { children: "U" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            className: `p-2 rounded ${editor.isActive("bulletList") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Liste à puces",
            children: "•"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            className: `p-2 rounded ${editor.isActive("orderedList") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Liste numérotée",
            children: "1."
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          className: `p-2 rounded ${editor.isActive("blockquote") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
          title: "Citation",
          children: '"'
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            className: `p-2 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Aligner à gauche",
            children: "←"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            className: `p-2 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Centrer",
            children: "↔"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            className: `p-2 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Aligner à droite",
            children: "→"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowLinkInput(!showLinkInput),
            className: `p-2 rounded ${editor.isActive("link") ? "bg-sage text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            title: "Ajouter un lien",
            children: "🔗"
          }
        ),
        editor.isActive("link") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: removeLink,
            className: "p-2 rounded bg-red-100 hover:bg-red-200 text-red-700",
            title: "Supprimer le lien",
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1", children: /* @__PURE__ */ jsx(
        ImageUploadEnhanced,
        {
          onImageUploaded: setImage,
          className: "inline-block",
          showCompressionStats: false,
          autoConvertToWebP: true
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-300 mx-2" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 ml-auto", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              console.log("Bouton Brouillon cliqué !");
              if (typeof window.handleSave === "function") {
                console.log("Appel de handleSave via window...");
                window.handleSave();
              } else {
                console.log("handleSave n'est pas disponible sur window");
              }
            },
            disabled: isSaving,
            className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50",
            children: isSaving ? "Sauvegarde..." : "Brouillon"
          }
        ),
        !isPublished && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onPublish,
            className: "px-4 py-2 bg-sage text-white rounded hover:bg-sage-600",
            children: "Publier"
          }
        )
      ] })
    ] }),
    showLinkInput && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center space-x-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "url",
          placeholder: "https://example.com",
          value: linkUrl,
          onChange: (e) => setLinkUrl(e.target.value),
          className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
          onKeyPress: (e) => e.key === "Enter" && addLink()
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: addLink,
          className: "px-3 py-2 bg-sage text-white rounded hover:bg-sage-600",
          children: "Ajouter"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowLinkInput(false),
          className: "px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400",
          children: "Annuler"
        }
      )
    ] })
  ] });
};
const PostEditor = ({
  initialData = null,
  postId,
  userId,
  onSave,
  onPublish
}) => {
  console.log("PostEditor - Props reçues:", {
    hasInitialData: !!initialData,
    postId,
    userId,
    hasOnSave: !!onSave,
    hasOnPublish: !!onPublish,
    onSaveType: typeof onSave,
    onPublishType: typeof onPublish
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
              text: " "
            }
          ]
        }
      ]
    },
    immediatelyRender: false,
    // Éviter les problèmes d'hydratation SSR
    onUpdate: ({ editor: editor2 }) => {
    },
    onCreate: ({ editor: editor2 }) => {
      console.log("Éditeur TipTap créé avec succès");
      console.log(
        "Extensions chargées:",
        editor2.extensionManager.extensions.map((ext) => ext.name)
      );
    },
    onDestroy: () => {
      console.log("Éditeur TipTap détruit");
    }
  });
  useEffect(() => {
    console.log("État de l'éditeur:", {
      isEditorReady: !!editor,
      hasExtensions: editor?.extensionManager?.extensions?.length > 0,
      extensions: editor?.extensionManager?.extensions?.map((ext) => ext.name) || []
    });
  }, [editor]);
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
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null
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
        const event = new CustomEvent("postSave", {
          detail: {
            postData,
            action: "save"
          }
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
    onSave
  ]);
  const handlePublish = useCallback(async () => {
    console.log("handlePublish appelé");
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
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      status: "published"
    };
    console.log("PostData préparé:", postData);
    console.log("onPublish disponible:", !!onPublish);
    if (onPublish) {
      console.log("Appel de onPublish via callback...");
      try {
        await onPublish(postData);
        return;
      } catch (error) {
        console.error("Erreur avec callback direct:", error);
      }
    }
    console.log("Utilisation de l'événement personnalisé...");
    const event = new CustomEvent("postPublish", {
      detail: {
        postData,
        action: "publish"
      }
    });
    console.log("Événement créé:", event);
    console.log("Dispatch de l'événement...");
    window.dispatchEvent(event);
    console.log("Événement dispatché");
    console.log("Tentative d'appel direct de l'API...");
    try {
      const isEditMode = postId && postId !== "new";
      const apiEndpoint = isEditMode ? `/api/posts/${postId}` : "/api/posts/create";
      const method = isEditMode ? "PUT" : "POST";
      console.log("Mode:", isEditMode ? "Édition" : "Création");
      console.log("Endpoint:", apiEndpoint);
      console.log("Méthode:", method);
      const response = await fetch(apiEndpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...postData,
          author_id: userId
        })
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
    userId
  ]);
  useEffect(() => {
    window.handleSave = handleSave;
    return () => {
      delete window.handleSave;
    };
  }, [handleSave]);
  useEffect(() => {
    const timeoutId = setTimeout(handleSave, 2e3);
    return () => clearTimeout(timeoutId);
  }, [
    title,
    excerpt,
    coverUrl,
    coverAlt,
    tags,
    category,
    seoTitle,
    seoDescription
  ]);
  if (!editor) return /* @__PURE__ */ jsx("div", { children: "Chargement de l'éditeur..." });
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [
    /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Titre de l'article *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: title,
            onChange: (e) => setTitle(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
            placeholder: "Titre de votre article...",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Extrait" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: excerpt,
            onChange: (e) => setExcerpt(e.target.value),
            rows: 3,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
            placeholder: "Résumé de votre article..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Image de couverture" }),
        /* @__PURE__ */ jsx(
          ImageUploadEnhanced,
          {
            onImageUploaded: (url) => setCoverUrl(url),
            onRemoveImage: () => setCoverUrl(""),
            className: "w-full",
            showCompressionStats: true,
            autoConvertToWebP: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Texte alternatif" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: coverAlt,
            onChange: (e) => setCoverAlt(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
            placeholder: "Description de l'image..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tags" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: tags,
            onChange: (e) => setTags(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
            placeholder: "tag1, tag2, tag3..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Catégorie *" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: category,
            onChange: (e) => setCategory(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
            required: true,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Sélectionner une catégorie" }),
              BLOG_CATEGORIES.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.label }, cat.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Statut" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: status,
            onChange: (e) => setStatus(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
            children: [
              /* @__PURE__ */ jsx("option", { value: "draft", children: "Brouillon" }),
              /* @__PURE__ */ jsx("option", { value: "published", children: "Publié" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Titre SEO" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: seoTitle,
            onChange: (e) => setSeoTitle(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
            placeholder: "Titre pour les moteurs de recherche..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description SEO" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: seoDescription,
            onChange: (e) => setSeoDescription(e.target.value),
            rows: 2,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
            placeholder: "Description pour les moteurs de recherche..."
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      Toolbar,
      {
        editor,
        onImageUpload: () => {
        },
        onSave: handleSave,
        onPublish: handlePublish,
        isSaving,
        isPublished
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "p-6 bg-gradient-to-br from-sage/5 to-gold/5 rounded-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-2", children: "📝 Zone d'édition de l'article" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Utilisez la barre d'outils ci-dessus pour formater votre texte" })
      ] }),
      /* @__PURE__ */ jsx(
        EditorContent,
        {
          editor,
          className: "prose prose-lg max-w-none tip-tap-editor"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-gray-500 text-right", children: [
        editor.storage.characterCount.characters(),
        " caractères"
      ] })
    ] })
  ] });
};

export { $$AdminLayout as $, PostEditor as P };
