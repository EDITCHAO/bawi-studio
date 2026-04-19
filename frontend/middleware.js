/**
 * Middleware Vercel pour les redirections et la gestion des requêtes
 * Ce fichier est optionnel mais recommandé pour les SPA React
 */

export default function middleware(request) {
  // Rediriger les requêtes non-fichier vers index.html
  const { pathname } = request.nextUrl;

  // Vérifier si c'est un fichier statique
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.[^/]+$/) // Fichiers avec extension
  ) {
    return;
  }

  // Rediriger vers index.html pour les routes React
  return new Response(null, { status: 307, headers: { location: '/' } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
