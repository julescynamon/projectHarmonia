-- Réactiver RLS sur la table blocked_times
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre la lecture publique des périodes bloquées
-- (nécessaire pour que l'API puisse vérifier les disponibilités)
CREATE POLICY "Permettre lecture publique des périodes bloquées" ON blocked_times
FOR SELECT
TO public
USING (true);

-- Policy pour permettre l'insertion par les admins uniquement
CREATE POLICY "Permettre insertion par les admins" ON blocked_times
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy pour permettre la mise à jour par les admins uniquement
CREATE POLICY "Permettre mise à jour par les admins" ON blocked_times
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy pour permettre la suppression par les admins uniquement
CREATE POLICY "Permettre suppression par les admins" ON blocked_times
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
