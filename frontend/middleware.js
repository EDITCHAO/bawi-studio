/**
 * Middleware Vercel pour les redirections et la gestion des requêtes
 * NOTE: Ce middleware n'est pas nécessaire pour une SPA Vite
 * Vercel gère automatiquement les redirections avec vercel.json
 */

export default function middleware(request) {
  // Middleware vide - Vercel gère les redirections via vercel.json
  return;
}

export const config = {
  matcher: [],
};
