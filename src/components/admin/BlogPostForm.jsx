import React, { useState, useRef } from 'react';
import { marked } from 'marked';

export default function BlogPostForm({ initialData = {} }) {
  const [title, setTitle] = useState(initialData && initialData.title ? initialData.title : '');
  const [content, setContent] = useState(initialData && initialData.content ? initialData.content : '');
  const [category, setCategory] = useState(initialData && initialData.category ? initialData.category : '');
  const [summary, setSummary] = useState(initialData && initialData.summary ? initialData.summary : '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  // Formatter le contenu Markdown
  const formatContent = (rawContent) => {
    // Convertir les ## en titres h2
    let formatted = rawContent.replace(/^# (.+)$/gm, '## $1');
    
    // Ajouter des sauts de ligne avant les listes
    formatted = formatted.replace(/^- /gm, '\n- ');
    
    // Ajouter des sauts de ligne avant les sections
    formatted = formatted.replace(/^##/gm, '\n##');
    
    return formatted;
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    // Le formulaire sera géré par le gestionnaire d'événements dans index.astro
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Catégorie</label>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage sm:text-sm"
          required
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="naturopathie">Naturopathie</option>
          <option value="alimentation">Alimentation</option>
          <option value="comportement">Comportement</option>
          <option value="education">Éducation</option>
          <option value="soins">Soins</option>
          <option value="actualites">Actualités</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Résumé</label>
        <textarea
          name="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage"
          >
            Choisir une image
          </button>
          {preview && (
            <div className="relative w-24 h-24">
              <img
                src={preview}
                alt="Aperçu"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contenu</label>
        <div className="mt-1">
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage sm:text-sm font-mono"
            placeholder="# Titre principal&#10;&#10;## Sous-titre&#10;&#10;Votre texte ici...&#10;&#10;- Point 1&#10;- Point 2&#10;&#10;[Texte du lien](https://www.example.com)&#10;[Lien avec info-bulle](https://www.example.com 'Description du lien')"
            required
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Utilisez la syntaxe Markdown pour formater votre texte. ## pour les titres, - pour les listes, etc.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sage hover:bg-sage-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage"
        >
          Publier l'article
        </button>
      </div>
    </form>
  );
}
