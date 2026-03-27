export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, contact, subject, message } = req.body;

    // Validation basique
    if (!name || !email || !contact || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Formatage du message pour WhatsApp
    const whatsappMessage = `
🔔 *NOUVEAU MESSAGE - BAWI-STUDIO*

👤 *Nom:* ${name}
📧 *Email:* ${email}
📱 *Contact:* ${contact}
📝 *Sujet:* ${subject}

💬 *Message:*
${message}

---
Envoyé depuis le site BAWI-STUDIO
    `.trim();

    // Envoi via WhatsApp Business API (CallMeBot - gratuit et simple)
    // Le message sera envoyé sur le WhatsApp de BAWI-STUDIO: 71760283 (Togo)
    const phoneNumber = '22871760283'; // Format international sans + (Togo)
    const apiKey = process.env.WHATSAPP_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      console.error('WhatsApp API key not configured');
      // En développement, on simule le succès
      console.log('Message qui serait envoyé:', whatsappMessage);
      return res.status(200).json({ 
        success: true, 
        message: 'Message reçu (mode développement - configurez WHATSAPP_API_KEY pour l\'envoi réel)' 
      });
    }
    
    const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(whatsappMessage)}&apikey=${apiKey}`;

    const response = await fetch(whatsappUrl);

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Message envoyé sur WhatsApp avec succès' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
