// Composant d'édition d'articles avec TipTap et conversion automatique WebP
// src/components/admin/PostEditorEnhanced.jsx

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

// Configuration des extensions TipTap
const extensions = [
  StarterKit.configure({
    heading: false,
    link: false,
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

// Composant de la barre d'outils avec conversion WebP
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

  return (
    <div className="border-b border-gray-200 p-4 bg-white rounded-t-lg">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Boutons de formatage */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive("bold")
              ? "bg-sage text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive("italic")
              ? "bg-sage text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive("underline")
              ? "bg-sage text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <u>S</u>
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Titres */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-sage text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-sage text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-sage text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Alignement */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive({ textAlign: "left" })
              ? "bg-sage text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ←
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive({ textAlign: "center" })
              ? "bg-sage text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ↔
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive({ textAlign: "right" })
              ? "bg-sage text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          →
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Liens */}
        {showLinkInput ? (
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL du lien"
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sage"
              onKeyPress={(e) => e.key === "Enter" && addLink()}
            />
            <button
              onClick={addLink}
              className="px-3 py-2 bg-sage text-white rounded text-sm hover:bg-sage/90"
            >
              Ajouter
            </button>
            <button
              onClick={() => setShowLinkInput(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            >
              Annuler
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowLinkInput(true)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                editor.isActive("link")
                  ? "bg-sage text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🔗
            </button>
            <button
              onClick={removeLink}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            >
              🔗❌
            </button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Upload d'image avec conversion WebP */}
        <div className="relative">
          <ImageUploadEnhanced
            onImageUploaded={setImage}
            className="inline-block"
            showCompressionStats={true}
            autoConvertToWebP={true}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {editor.storage.characterCount.characters()} caractères
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          <button
            onClick={onPublish}
            disabled={isSaving}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              isPublished
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-sage text-white hover:bg-sage/90"
            } disabled:opacity-50`}
          >
            {isPublished ? "Publié" : "Publier"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const PostEditorEnhanced = ({ post, onSave, onPublish }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || "");
  const [coverUrl, setCoverUrl] = useState(post?.cover_url || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(post?.status === "published");

  const editor = useEditor({
    extensions,
    content: post?.content || "",
    onUpdate: ({ editor }) => {
      // Auto-save optionnel
    },
  });

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      const postData = {
        title,
        excerpt,
        category,
        cover_url: coverUrl,
        content: editor.getJSON(),
        status: isPublished ? "published" : "draft",
      };

      if (post?.id) {
        await PostsService.updatePost(post.id, postData);
      } else {
        await PostsService.createPost(postData);
      }

      onSave?.(postData);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublished(!isPublished);
    await handleSave();
    onPublish?.(!isPublished);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Formulaire de base */}
      <div className="p-6 border-b border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'article
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Titre de votre article..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extrait (description courte)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Description courte de l'article..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
              >
                <option value="">Sélectionner une catégorie</option>
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de couverture
              </label>
              <ImageUploadEnhanced
                onImageUploaded={setCoverUrl}
                showCompressionStats={true}
                autoConvertToWebP={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Éditeur TipTap */}
      <div className="min-h-[500px]">
        <Toolbar
          editor={editor}
          onSave={handleSave}
          onPublish={handlePublish}
          isSaving={isSaving}
          isPublished={isPublished}
        />
        <div className="p-6">
          <EditorContent
            editor={editor}
            className="prose prose-lg max-w-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PostEditorEnhanced;
