# Backend (NestJS) - Smart Invoice Generator

Quick start:

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set your values (MONGO_URL, JWT secrets, SMTP, CLOUDINARY, etc.)
3. Start dev server: `npm run start:dev` (uses ts-node-dev)

Health endpoint: GET `/api/health` returns `{ status: 'ok' }`.
