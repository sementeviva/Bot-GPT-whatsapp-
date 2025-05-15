const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(bodyParser.json());

// Rota GET opcional (teste no navegador)
app.get('/', (req, res) => {
  res.send('Bot GPT está online!');
});

// Rota POST principal
app.post('/webhook', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Mensagem ausente no corpo da requisição.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const reply = response.data.choices[0].message.content.trim();

    res.json({ reply });
  } catch (error) {
    console.error('Erro na API do GPT:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao gerar resposta do GPT.' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
