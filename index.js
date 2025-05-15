require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é um atendente da loja Semente Viva. Seja gentil e ofereça produtos naturais.' },
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = gptResponse.data.choices[0].message.content;
    res.send({ reply });
  } catch (error) {
    console.error('Erro ao consultar a API da OpenAI:', error.response?.data || error.message);
    res.status(500).send({ error: 'Erro ao gerar resposta da IA' });
  }
});

app.listen(3000, () => {
  console.log('Bot rodando na porta 3000');
});
