-- Créer la table contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
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
  status VARCHAR(50) DEFAULT 'new',
  priority VARCHAR(50) DEFAULT 'normal',
  notes TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);

-- Activer RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Politique pour les lectures publiques (pas de lecture directe)
CREATE POLICY "Disable public read" ON contact_messages
  FOR SELECT USING (FALSE);

-- Politique pour les insertions publiques (soumettre un message)
CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);

-- Politique pour les lectures authentifiées (admin)
CREATE POLICY "Allow authenticated read" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Politique pour les mises à jour authentifiées (admin)
CREATE POLICY "Allow authenticated update" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Politique pour les suppressions authentifiées (admin)
CREATE POLICY "Allow authenticated delete" ON contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');
