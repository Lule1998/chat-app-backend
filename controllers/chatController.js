const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

exports.processMessage = async (message, conversationHistory = []) => {
    try {
        const messages = [...conversationHistory, { role: "user", content: message }];

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 2000,
            temperature: 0.7,
        });

        return {
            id: Date.now(),
            content: completion.data.choices[0].message.content,
            role: 'assistant',
            timestamp: new Date()
        };
    } catch (error) {
        throw new Error(`Failed to process message: ${error.message}`);
    }
};