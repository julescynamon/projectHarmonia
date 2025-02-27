// Script pour récupérer le token Supabase
console.log('Recherche du token Supabase...');

try {
    const cookies = document.cookie;
    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('supabase.auth.token='));
    
    if (!tokenCookie) {
        console.error('Token non trouvé dans les cookies');
        return;
    }

    const tokenData = JSON.parse(decodeURIComponent(tokenCookie.split('=')[1]));
    console.log('\nVotre token d\'accès (à copier) :\n');
    console.log(tokenData.access_token);
    
    // Copier dans le presse-papiers
    navigator.clipboard.writeText(tokenData.access_token)
        .then(() => console.log('\nToken copié dans le presse-papiers !'))
        .catch(err => console.log('\nImpossible de copier automatiquement le token:', err));

} catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
}
