require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Google Gemini API bağlantısı - (Stitch MCP Engine)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'no-key' });

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, currentConfig } = req.body;
    
    if (process.env.GEMINI_API_KEY === 'no-key' || !process.env.GEMINI_API_KEY) {
      console.log("No API key, falling back to mock logic inside app...");
      return res.status(500).json({ error: "No API KEY" });
    }

    const systemPrompt = `Sen Stitch MCP tarafından yönetilen bir oyun tasarımcısısın.
Kullanıcının yazdığı isteği anla ve oyunun JSON yapılandırmasında istenen değişiklikleri yap. 
Şu anki JSON config: ${JSON.stringify(currentConfig)}

Beklenen Çıktı formatı sadece tam bir JSON objesi olmalıdır:
{
  "backgroundColor": "#RenkKodu",
  "platformColor": "#RenkKodu",
  "characterEmoji": "Emoji",
  "platformSpeed": 0, // Hız çarpanı, durmasını isterse 0
  "platformWidth": 70, // Platform genişliği
  "jumpForce": -13, // Zıplama gücü. Daha yükseğe zıplamak için örneğin -16 yap (eksi değer olmalı)
  "gravity": 0.6, // Yerçekimi kuvveti
  "playerSize": 40 // Karakter büyüklüğü
}

Markdown etiketi kullanma. Sadece JSON döndür.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json'
      }
    });

    const jsonObj = JSON.parse(response.text);
    res.json(jsonObj);
  } catch (error) {
    console.error('MCP Hatası:', error);
    res.status(500).json({ error: 'Stitch MCP Error' });
  }
});

app.listen(3000, () => {
    console.log('Stitch MCP Engine API running on http://localhost:3000');
    console.log('Node.js Backend aktif...');
});
