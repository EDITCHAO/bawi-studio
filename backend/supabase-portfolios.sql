-- Créer la table portfolios
CREATE TABLE IF NOT EXISTS portfolios (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(50) DEFAULT 'web',
  technologies TEXT,
  link VARCHAR(500),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON portfolios(category);
CREATE INDEX IF NOT EXISTS idx_portfolios_order_index ON portfolios(order_index);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios(created_at DESC);

-- Activer RLS (Row Level Security)
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read" ON portfolios
  FOR SELECT
  USING (true);

-- Politique pour permettre la création/modification/suppression authentifiée (admin)
CREATE POLICY "Allow authenticated write" ON portfolios
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated update" ON portfolios
  FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated delete" ON portfolios
  FOR DELETE
  USING (auth.role() = 'service_role');

-- Insérer des données de test
INSERT INTO portfolios (title, description, category, technologies, link, order_index) VALUES
(
  'Site Vitrine - BAWI-STUDIO',
  'Site vitrine moderne et responsive pour présenter les services de BAWI-STUDIO. Développé avec React, Vite et Tailwind CSS.',
  'web',
  'React, Vite, Tailwind CSS, JavaScript',
  'https://bawi-studio.vercel.app',
  1
),
(
  'Plateforme E-commerce',
  'Plateforme de vente en ligne complète avec panier, paiement et gestion des commandes. Intégration Stripe et Supabase.',
  'web',
  'React, Node.js, Express, Supabase, Stripe',
  'https://example-ecommerce.com',
  2
),
(
  'Application Mobile - Gestion de Tâches',
  'Application mobile pour la gestion des tâches quotidiennes avec synchronisation cloud. Disponible sur iOS et Android.',
  'mobile',
  'React Native, Firebase, Redux',
  'https://play.google.com/store/apps/details?id=com.example.tasks',
  3
),
(
  'Dashboard Analytique',
  'Dashboard interactif pour l\'analyse des données en temps réel. Graphiques dynamiques et rapports personnalisés.',
  'web',
  'React, Chart.js, D3.js, Node.js',
  'https://example-dashboard.com',
  4
),
(
  'Système de Gestion Scolaire',
  'Plateforme complète de gestion scolaire avec gestion des élèves, notes et communications parent-école.',
  'web',
  'React, Express, PostgreSQL, JWT',
  'https://example-school.com',
  5
),
(
  'Application Fintech',
  'Application de gestion financière personnelle avec suivi des dépenses et budgets. Sécurisée et conforme aux normes bancaires.',
  'mobile',
  'Flutter, Firebase, Dart',
  'https://example-fintech.com',
  6
);
