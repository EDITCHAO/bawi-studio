/**
 * Configuration de l'application
 */

// URL de l'API Backend
// Utilise la variable d'environnement VITE_API_URL si définie,
// sinon utilise localhost par défaut
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Endpoints de l'API
export const API_ENDPOINTS = {
  // Public
  contact: `${API_URL}/api/contact`,
  
  // Admin
  adminLogin: `${API_URL}/api/admin/login`,
  adminStats: `${API_URL}/api/admin/stats`,
  clientMessages: `${API_URL}/api/admin/client-messages`,
  generalMessages: `${API_URL}/api/admin/general-messages`,
  trash: `${API_URL}/api/admin/trash`,
  acceptClientMessage: `${API_URL}/api/admin/accept-client-message`,
  
  // Projects
  projects: `${API_URL}/api/admin/projects`,
  
  // Portfolio
  portfolio: `${API_URL}/api/admin/portfolio`,
  portfolioAdd: `${API_URL}/api/admin/portfolio/add`,
  portfolioReorder: `${API_URL}/api/admin/portfolio/reorder`,
};

export default { API_URL, API_ENDPOINTS };
