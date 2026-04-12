/**
 * Configuration de l'application
 * Backend: Node.js/Express + Supabase
 */

// URL de l'API Backend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Endpoints de l'API
export const API_ENDPOINTS = {
  // Public
  contact: `${API_URL}/api/contact`,
  health: `${API_URL}/api/health`,
  portfolios: `${API_URL}/api/portfolios`,
  
  // Admin
  adminLogin: `${API_URL}/api/admin/login`,
  adminStats: `${API_URL}/api/admin/stats`,
  clientMessages: `${API_URL}/api/admin/client-messages`,
  adminPortfolios: `${API_URL}/api/admin/portfolios`,
};

export default { API_URL, API_ENDPOINTS };
