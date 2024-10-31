const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();


app.use(cors({
    origin: 'http://localhost:4200',  
    methods: ['GET', 'POST'],         
    allowedHeaders: ['Content-Type'],
    credentials: true                 
}));


app.use(express.json());


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);


app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

       
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
            max_tokens: 2000,
            temperature: 0.7,
        });

        
        res.json({
            id: Date.now(),
            content: completion.data.choices[0].message.content,
            role: 'assistant',
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Error communicating with AI service',
            details: error.message
        });
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        details: err.message
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
