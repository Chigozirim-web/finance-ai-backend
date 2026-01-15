# AI-Assisted Finance Backend

An AI-powered backend API built with TypeScript, Fastify, Prisma, and OpenAI. This service:
1. Receives user **financial transaction data**  
2. Automatically **categorizes spending** using large language models (LLMs)  
3. Returns **natural-language insights** about user spending habits

## Features
- Fastify-based API for transactions and insights
- Prisma as the ORM for database access
- OpenAI integration for spending categorization and insight generation
- Designed to support future frontend or mobile clients

## Tech Stack
- TypeScript  
- Fastify  
- Prisma  
- OpenAI API

## Endpoints (Example)
- `POST /transactions` — Submit transaction data  
- `GET /insights` — Retrieve financial insights based on stored transactions

## Local Setup
1. Clone the repo  
   ```bash
   git clone https://github.com/Chigozirim-web/finance-ai-backend.git
   cd finance-ai-backend
2. Install dependencies
   ```bash
   npm install
3. ### Environment Variables
    Create a .env file:
   ```bash
   DATABASE_URL="your_db_connection_string"
   OPENAI_API_KEY="your_openai_api_key"
4. ### Database Setup
    Generate the Prisma client:  
   ```bash
   npx prisma generate
   ```
   If you have migrations:  
   ```bash
   npx prisma migrate dev
   ```
5. Run Development Server 
   ```bash
   npm run dev
   ```

## Roadmap
- Add user authentication
- Add tests (unit & integration)
- Add rate limiting and logging
- Add more categorized insight endpoints
