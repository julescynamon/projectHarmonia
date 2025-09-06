-- Supprimer l'article de test de la table blog_posts
DELETE FROM blog_posts 
WHERE id = '17800600-2d6f-4aa4-b8e4-97a8ee90f866';

-- Vérifier que l'article a été supprimé
SELECT COUNT(*) as remaining_articles FROM blog_posts;
