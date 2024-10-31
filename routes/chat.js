const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Middleware za proveru API ključa
const checkApiKey = (req, res, next) => {
    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }
    next();
};

// Chat ruta
router.post('/', checkApiKey, async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Priprema poruka za API poziv
        const messages = [
            ...conversationHistory,
            { role: "user", content: message }
        ];

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 2000,
            temperature: 0.7,
            presence_penalty: 0.6,
            frequency_penalty: 0.6,
        });

        res.json({
            id: Date.now(),
            content: completion.data.choices[0].message.content,
            role: 'assistant',
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Failed to get response from AI',
            details: error.message
        });
    }
});

module.exports = router;
