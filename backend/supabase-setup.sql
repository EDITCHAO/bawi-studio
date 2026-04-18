-- Créer la table contact_messages
CREATE TABLE contact_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  domain VARCHAR(50),
  project_type VARCHAR(50),
  budget VARCHAR(50),
  deadline VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  cahier_de_charge_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'new',
  priority VARCHAR(50),
  notes TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index pour contact_messages
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_read ON contact_messages(read);
CREATE INDEX idx_contact_messages_deleted_at ON contact_messages(deleted_at);

-- Activer RLS (Row Level Security) pour contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (formulaire de contact)
CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read" ON contact_messages
  FOR SELECT
  USING (true);

-- Créer la table portfolios
CREATE TABLE portfolios (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category VARCHAR(50) DEFAULT 'web',
  technologies TEXT,
  link VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index pour portfolios
CREATE INDEX idx_portfolios_category ON portfolios(category);
CREATE INDEX idx_portfolios_order_index ON portfolios(order_index);
CREATE INDEX idx_portfolios_created_at ON portfolios(created_at DESC);

-- Activer RLS (Row Level Security) pour portfolios
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des portfolios
CREATE POLICY "Allow public read" ON portfolios
  FOR SELECT
  USING (true);

-- Créer les buckets de stockage
INSERT INTO storage.buckets (id, name, public)
VALUES ('cahiers-de-charge', 'cahiers-de-charge', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolios', 'portfolios', true)
ON CONFLICT DO NOTHING;

-- Configurer les politiques de stockage pour cahiers-de-charge
CREATE POLICY "Allow public read cahiers" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cahiers-de-charge');

CREATE POLICY "Allow authenticated upload cahiers" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'cahiers-de-charge');

-- Configurer les politiques de stockage pour portfolios
CREATE POLICY "Allow public read portfolios" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolios');

CREATE POLICY "Allow authenticated upload portfolios" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolios');
