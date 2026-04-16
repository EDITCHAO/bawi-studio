import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://bawi-studio.vercel.app',
    'https://www.bawi-studio.com',
    'https://bawi-studio.com',
    'https://bawi-studio.onrender.com',
    'https://bawi-studio-backend.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Supabase client avec clé de service (pour les opérations admin)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Login admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password, username } = req.body;

    console.log('🔐 Tentative de login:', { username, password: '***' });

    if (!password) {
      return res.status(400).json({ error: 'Mot de passe requis' });
    }

    // Vérifier le mot de passe avec bcrypt
    const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (!isValid) {
      console.log('❌ Mot de passe invalide');
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    console.log('✅ Authentification réussie');

    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ 
      success: true,
      token,
      admin: {
        id: 1,
        username: 'admin',
        email: 'admin@bawi-studio.com'
      }
    });
  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Soumettre un message de contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, contact, domain, customDomain, projectType, budget, deadline, message } = req.body;
    let cahierDeChargeUrl = null;

    console.log('📨 Message reçu:', { name, email, contact, domain, customDomain, projectType, budget, deadline, message });

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Gérer l'upload du cahier de charge s'il existe
    if (req.files && req.files.cahierDeCharge) {
      try {
        const file = req.files.cahierDeCharge;
        const fileName = `cahier-${Date.now()}-${file.name}`;

        // Uploader sur Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('cahiers-de-charge')
          .upload(fileName, file.data, {
            contentType: file.mimetype
          });

        if (uploadError) {
          console.error('❌ Erreur upload Supabase:', uploadError);
          return res.status(500).json({ error: 'Erreur lors de l\'upload du fichier' });
        }

        // Obtenir l'URL publique
        const { data: publicData } = supabase.storage
          .from('cahiers-de-charge')
          .getPublicUrl(fileName);

        cahierDeChargeUrl = publicData.publicUrl;
        console.log('✅ Fichier uploadé:', cahierDeChargeUrl);
      } catch (uploadErr) {
        console.error('❌ Erreur upload:', uploadErr);
        // Continuer même si l'upload échoue (le fichier est optionnel)
      }
    }

    // Si le domaine est "other", utiliser customDomain
    const finalDomain = domain === 'other' ? customDomain : domain;

    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone: contact || null,
          domain: finalDomain || null,
          project_type: projectType || null,
          budget: budget || null,
          deadline: deadline || null,
          subject: null,
          message,
          cahier_de_charge_url: cahierDeChargeUrl,
          created_at: new Date().toISOString(),
          read: false
        }
      ])
      .select();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return res.status(500).json({ error: `Erreur Supabase: ${error.message}` });
    }

    console.log('✅ Message enregistré:', data);
    res.status(201).json({ success: true, id: data[0].id });
  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
});});

// Récupérer tous les messages clients (admin)
app.get('/api/admin/client-messages', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération' });
    }

    res.json(data);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer un message spécifique
app.get('/api/admin/client-messages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Marquer comme lu
    if (!data.read) {
      await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);
    }

    res.json(data);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour un message
app.put('/api/admin/client-messages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, notes } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (notes) updates.notes = notes;

    const { data, error } = await supabase
      .from('contact_messages')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }

    res.json({ success: true, message: 'Message mis à jour' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un message
app.delete('/api/admin/client-messages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le message pour obtenir l'URL du cahier
    const { data: message, error: fetchError } = await supabase
      .from('contact_messages')
      .select('cahier_de_charge_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Erreur lors de la récupération du message:', fetchError);
      return res.status(500).json({ error: 'Message non trouvé' });
    }

    // Supprimer le fichier du cahier de charge s'il existe
    if (message && message.cahier_de_charge_url) {
      try {
        // Extraire le nom du fichier de l'URL
        const fileName = message.cahier_de_charge_url.split('/').pop();
        
        console.log('🗑️ Suppression du fichier:', fileName);
        
        const { error: deleteFileError } = await supabase.storage
          .from('cahiers-de-charge')
          .remove([fileName]);

        if (deleteFileError) {
          console.error('⚠️ Erreur lors de la suppression du fichier:', deleteFileError);
          // Continuer même si la suppression du fichier échoue
        } else {
          console.log('✅ Fichier supprimé');
        }
      } catch (fileError) {
        console.error('⚠️ Erreur lors de la suppression du fichier:', fileError);
        // Continuer même si la suppression du fichier échoue
      }
    }

    // Soft delete - marquer comme supprimé au lieu de vraiment supprimer
    const { error } = await supabase
      .from('contact_messages')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }

    res.json({ success: true, message: 'Message et fichier supprimés' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les messages supprimés (corbeille)
app.get('/api/admin/client-messages/trash/list', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération' });
    }

    res.json(data);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Restaurer un message de la corbeille
app.post('/api/admin/client-messages/:id/restore', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('contact_messages')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la restauration' });
    }

    res.json({ success: true, message: 'Message restauré' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer définitivement un message
app.delete('/api/admin/client-messages/:id/permanent', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le message pour obtenir l'URL du cahier
    const { data: message, error: fetchError } = await supabase
      .from('contact_messages')
      .select('cahier_de_charge_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Erreur lors de la récupération du message:', fetchError);
      return res.status(500).json({ error: 'Message non trouvé' });
    }

    // Supprimer le fichier du cahier de charge s'il existe
    if (message && message.cahier_de_charge_url) {
      try {
        // Extraire le nom du fichier de l'URL
        const fileName = message.cahier_de_charge_url.split('/').pop();
        
        console.log('🗑️ Suppression du fichier:', fileName);
        
        const { error: deleteFileError } = await supabase.storage
          .from('cahiers-de-charge')
          .remove([fileName]);

        if (deleteFileError) {
          console.error('⚠️ Erreur lors de la suppression du fichier:', deleteFileError);
          // Continuer même si la suppression du fichier échoue
        } else {
          console.log('✅ Fichier supprimé');
        }
      } catch (fileError) {
        console.error('⚠️ Erreur lors de la suppression du fichier:', fileError);
        // Continuer même si la suppression du fichier échoue
      }
    }

    // Supprimer le message de la base de données
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }

    res.json({ success: true, message: 'Message et fichier supprimés définitivement' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les statistiques
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*');

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération' });
    }

    const total = data.length;
    const newMessages = data.filter(m => !m.read).length;
    const byDomain = {};
    
    data.forEach(msg => {
      if (msg.domain) {
        byDomain[msg.domain] = (byDomain[msg.domain] || 0) + 1;
      }
    });

    res.json({
      success: true,
      client_messages: {
        total,
        new: newMessages,
        in_progress: 0
      },
      general_messages: {
        total: 0,
        new: 0
      },
      by_domain: Object.entries(byDomain).map(([domain, count]) => ({ domain, count })),
      recent_messages: data.slice(0, 10)
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===== ENDPOINTS PORTFOLIO =====

// Endpoint d'upload d'image
app.post('/api/admin/portfolios/upload', authenticateToken, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const file = req.files.file;
    const fileName = `${Date.now()}-${file.name}`;

    // Uploader sur Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('portfolios')
      .upload(fileName, file.data, {
        contentType: file.mimetype
      });

    if (uploadError) {
      console.error('Erreur upload Supabase:', uploadError);
      return res.status(500).json({ error: 'Erreur lors de l\'upload' });
    }

    // Obtenir l'URL publique
    const { data: publicData } = supabase.storage
      .from('portfolios')
      .getPublicUrl(fileName);

    console.log('✅ Image uploadée:', publicData.publicUrl);
    res.json({ success: true, imageUrl: publicData.publicUrl });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer tous les portfolios (public)
app.get('/api/portfolios', async (req, res) => {
  try {
    console.log('📋 Tentative de récupération des portfolios...');
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    
    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('❌ Erreur Supabase complète:', JSON.stringify(error, null, 2));
      return res.status(500).json({ 
        error: 'Erreur lors de la récupération',
        details: error.message,
        code: error.code
      });
    }

    console.log('✅ Portfolios récupérés:', data.length);
    res.json(data);
  } catch (error) {
    console.error('❌ Erreur serveur complète:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      details: error.message
    });
  }
});

// Récupérer tous les portfolios (admin)
app.get('/api/admin/portfolios', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération' });
    }

    res.json(data);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un portfolio
app.post('/api/admin/portfolios', authenticateToken, async (req, res) => {
  try {
    const { title, description, image_url, category, technologies, link, order_index } = req.body;

    console.log('📝 Création portfolio:', { title, description, category });

    if (!title || !description) {
      return res.status(400).json({ error: 'Titre et description requis' });
    }

    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .insert([
        {
          title,
          description,
          image_url: image_url || null,
          category: category || 'web',
          technologies: technologies || null,
          link: link || null,
          order_index: order_index || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ Erreur Supabase INSERT:', error);
      return res.status(500).json({ error: `Erreur Supabase: ${error.message}` });
    }

    console.log('✅ Portfolio créé:', data);
    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
});

// Mettre à jour un portfolio
app.put('/api/admin/portfolios/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, category, technologies, link, order_index } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (category) updates.category = category;
    if (technologies !== undefined) updates.technologies = technologies;
    if (link !== undefined) updates.link = link;
    if (order_index !== undefined) updates.order_index = order_index;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }

    console.log('✅ Portfolio mis à jour:', data);
    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un portfolio
app.delete('/api/admin/portfolios/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }

    console.log('✅ Portfolio supprimé:', id);
    res.json({ success: true, message: 'Portfolio supprimé' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
