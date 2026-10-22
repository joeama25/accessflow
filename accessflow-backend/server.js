require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const USE_MOCK = !process.env.YARNGPT_API_KEY || process.env.YARNGPT_API_KEY === 'MOCK';

app.post('/api/tts', async (req, res) => {
  const { text, language } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  if (USE_MOCK) {
    return res.status(501).json({ error: 'Mock mode' });
  }

  try {
    const voiceMap = { 
      yo: 'Idera', 
      ig: 'Chinenye', 
      ha: 'Abubakar', 
      pcm: 'Emma', 
      en: 'Emma' 
    };

    const response = await axios.post(
      'https://api.yarngpt.ai/api/v1/streaming/conversation',
      {
        text: text,
        voice: voiceMap[language] || 'Emma',
        output_format: 'mp3'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.YARNGPT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 15000
      }
    );

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.data);
  } catch (error) {
    const errData = error.response?.data;
    console.error('TTS Error:', errData ? Buffer.from(errData).toString() : error.message);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'running', mode: USE_MOCK ? 'MOCK' : 'LIVE' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AccessFlow AI Backend running on http://localhost:${PORT}`);
  console.log(`Mode: ${USE_MOCK ? 'MOCK' : 'LIVE (YarnGPT Streaming)'}`);
});