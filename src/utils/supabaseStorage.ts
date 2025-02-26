import { supabase } from '../lib/supabase';

export async function getPublicImageUrl(bucket: string, path: string): Promise<string> {
  try {
    const { data } = await supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'URL publique:', error);
    return ''; // Retourner une chaîne vide en cas d'erreur
  }
}
