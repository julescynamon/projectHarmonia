/*
  # Configuration du stockage des PDF

  1. Vérification et création du bucket
  2. Configuration des politiques de sécurité
    - Lecture uniquement pour les PDF achetés
    - Désactivation de l'écriture/modification/suppression
*/

-- Création du bucket "pdfs" s'il n'existe pas déjà
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'pdfs'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('pdfs', 'pdfs', false);
  END IF;
END $$;

-- Création des politiques de sécurité
DO $$ 
BEGIN
  -- Politique de lecture sécurisée
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Les utilisateurs peuvent télécharger les PDF achetés'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
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
  END IF;

  -- Politique pour désactiver l'upload
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Désactiver l''upload de fichiers'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Désactiver l'upload de fichiers"
    ON storage.objects FOR INSERT
    WITH CHECK (false);
  END IF;

  -- Politique pour désactiver la modification
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Désactiver la modification de fichiers'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Désactiver la modification de fichiers"
    ON storage.objects FOR UPDATE
    WITH CHECK (false);
  END IF;

  -- Politique pour désactiver la suppression
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Désactiver la suppression de fichiers'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Désactiver la suppression de fichiers"
    ON storage.objects FOR DELETE
    USING (false);
  END IF;
END $$;