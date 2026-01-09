import Fastify from 'fastify';
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const fastify = Fastify({
  logger: true
})

/**
 * TODO:
 * Routes:
 * - POST /transactions -> Accepts transaction data, stores in DB and categorizes using AI
 * - GET /transactions -> Retrieves user's transaction history
 * - GET /insights -> Provides financial insights based on user's transaction history using AI
 * - POST /ask -> Accepts user questions and provides AI-generated answers about personal finance
 */

// Get Users Transactions
fastify.get('/transactions', async (request, reply) => {
  // Placeholder for fetching transactions logic
  return { transactions: [] };
});

//Post AI-generated Suggestions
fastify.post('/transactions', async (request, reply) => {
    const { prompt } = request.body as { prompt: string };

    const aiResponse = await client.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
            { role: "system", content: "You are a helpful financial assistant." },
            { role: "user", content: prompt }
        ]
    });
    return { suggestion: aiResponse.choices[0].message?.content ?? "No response generated" };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();



const response = await client.responses.create({
    model: "gpt-5-nano",
    input: "Write a one-sentence bedtime story about a unicorn."
});

console.log(response.output_text);