/*
  # Configuration des politiques de stockage

  1. Sécurité
    - Création du bucket "pdfs"
    - Configuration des politiques d'accès aux fichiers PDF
    - Protection des fichiers pour les utilisateurs authentifiés ayant acheté les produits

  2. Politiques
    - Lecture : uniquement pour les utilisateurs ayant acheté le produit
    - Écriture : désactivée pour les utilisateurs
*/

-- Création du bucket "pdfs" s'il n'existe pas déjà
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', false)
ON CONFLICT DO NOTHING;

-- Politique de lecture : vérifier que l'utilisateur a acheté le produit
CREATE POLICY "Les utilisateurs peuvent télécharger les PDF achetés"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'pdfs'
  AND EXISTS (
    SELECT 1 FROM order_items
    JOIN orders ON orders.id = order_items.order_id
    JOIN products ON products.id = order_items.product_id
    WHERE orders.user_id = auth.uid()
    AND products.pdf_path = name
    AND orders.status = 'completed'
  )
);

-- Désactiver l'accès en écriture pour les utilisateurs
CREATE POLICY "Désactiver l'upload de fichiers"
ON storage.objects FOR INSERT
WITH CHECK (false);

CREATE POLICY "Désactiver la modification de fichiers"
ON storage.objects FOR UPDATE
WITH CHECK (false);

CREATE POLICY "Désactiver la suppression de fichiers"
ON storage.objects FOR DELETE
USING (false);