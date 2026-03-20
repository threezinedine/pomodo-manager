import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TODO: Auth routes
// TODO: Task routes
// TODO: Category routes
// TODO: Session routes
// TODO: Event routes
// TODO: Report routes
// TODO: Settings routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, prisma };
