import { prisma } from '../lib/prisma';
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

const possibleCategories = ["Groceries", "Utilities", "Rent", "Shopping", "Beauty", "Entertainment", "Dining", "Travel", "Health", "Other"];

/* Post transaction data to DB and AI categorises it */
fastify.post("/transactions", async (request, reply) => {
  const { amount, merchant, date } = request.body as {
    amount: number;
    merchant: string;
    date: string;
  };

  // Ask AI to categorize
  const aiResponse = await client.chat.completions.create({
    model:  "gpt-5-nano", //"gpt-4o-mini"
    messages: [
      {
        role: "system",
        content: "You are a finance categorization assistant."
      },
      {
        role: "user",
        content: `Categorize this transaction: ${merchant}, €${amount}, based on the following categories: ${possibleCategories.join(", ")}. 
        Respond with only the category name that best fits the transaction.`
      }
    ]
  });

  if (!aiResponse) {
    throw new Error("Failed to categorize transaction");
  }
  const category = aiResponse.choices[0]?.message.content || "Other";

  const tx = await prisma.transaction.create({
    data: {
      amount,
      merchant,
      category,
      date: new Date(date),
      userId: 1 // Placeholder user ID
    }
  });

  console.log("Created transaction:", tx);

  return tx;
});

/* Ask AI Questions about your finances/transactions */
fastify.post("/ask", async (request) => {
  const { question } = request.body as { question: string };

  const transactions = await prisma.transaction.findMany();

  const aiResponse = await client.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      {
        role: "system",
        content: "You are a financial analyst. Use the provided data to answer."
      },
      {
        role: "user",
        content: `
          Here are my transactions:
          ${JSON.stringify(transactions)}

          Question: ${question}
        `
      }
    ]
  });

  return { answer: aiResponse.choices[0]?.message.content || "I cannot accurately answer your question with the transaction data I have" };
});


/* Get Users Transactions */ 
fastify.get('/transactions', async (request, reply) => {
  const transactions = await prisma.transaction.findMany({ where: { userId: 1 } }); // Placeholder user ID
  return { transactions };
});

/* Get AI Insights on Spending */
fastify.get('/insights', async (request, reply) => {
  const transactions = await prisma.transaction.findMany({ where: { userId: 1 } }); // Placeholder user ID

  const aiResponse = await client.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      {
        role: "system",
        content: "You are a financial insights generator."
      },
      {
        role: "user",
        content: `
          Here are my transactions:
          ${JSON.stringify(transactions)}

          Provide insights on my spending habits.
        `
      }
    ]
  });

  return { insights: aiResponse.choices[0]?.message.content || "No insights available" };
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