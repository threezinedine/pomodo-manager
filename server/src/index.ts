import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();

const PORT = process.env.PORT || 3001;
const dbUrl = process.env.DATABASE_URL ?? 'not set';
const dbProvider = process.env.DATABASE_PROVIDER ?? 'not set';

// Warn if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  console.warn('[server] WARNING: DATABASE_URL is not set. Prisma will fail to connect.');
}

app.use(cors());
app.use(express.json());

// Health check — includes env info for debugging
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV ?? 'not set',
      DATABASE_PROVIDER: dbProvider,
    },
  });
});

// TODO: Auth routes
// TODO: Task routes
// TODO: Category routes
// TODO: Session routes
// TODO: Event routes
// TODO: Report routes
// TODO: Settings routes

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
  console.log(`[server] DATABASE_PROVIDER=${dbProvider}`);
  console.log(`[server] DATABASE_URL=${dbUrl.replace(/:[^:@]+@/, ':***@')}`); // mask password
});

export { app };
