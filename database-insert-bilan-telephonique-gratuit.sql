-- Ajout du bilan téléphonique gratuit (prix 0 = pas de Stripe à l'approbation)
-- La colonne "icon" est NOT NULL sur beaucoup de schémas : obligatoire ici.

ALTER TABLE services
DROP CONSTRAINT IF EXISTS services_category_check;

ALTER TABLE services
ADD CONSTRAINT services_category_check
CHECK (category IN (
  'naturopathie-humaine',
  'naturopathie-animale',
  'soins-energetiques',
  'accompagnement',
  'offre-gratuite'
));

INSERT INTO services (id, title, price, duration, description, icon, category)
VALUES (
  'bilan-telephonique-gratuit',
  'Bilan téléphonique gratuit',
  0,
  '30min',
  'Échange téléphonique de 30 minutes pour faire le point sur vos besoins, répondre à vos questions et vous orienter vers l''accompagnement le plus adapté — sans engagement.',
  'phone_in_talk',
  'offre-gratuite'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  duration = EXCLUDED.duration,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category;

SELECT id, title, price, duration, icon, category
FROM services
WHERE id = 'bilan-telephonique-gratuit';
