import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, locals }) => {
    const { data: { session } } = await locals.supabase.auth.getSession();
    if (!session?.user || session.user.email !== 'tyzranaima@gmail.com') {
        return new Response(JSON.stringify({ error: 'Non autorisé' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const data = await request.formData();
        const title = data.get('title') as string;
        const description = data.get('description') as string;
        const price = parseFloat(data.get('price') as string);
        const category = data.get('category') as string;
        const pdf = data.get('pdf') as File;

        // 1. Upload du PDF
        const pdfPath = `guides/${pdf.name}`;
        const { error: uploadError } = await locals.supabase.storage
            .from('pdfs')
            .upload(pdfPath, pdf, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // 2. Création du produit
        const { error: insertError } = await locals.supabase
            .from('products')
            .insert({
                title,
                description,
                price,
                category,
                pdf_path: pdfPath
            });

        if (insertError) throw insertError;

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Erreur:', error);
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

