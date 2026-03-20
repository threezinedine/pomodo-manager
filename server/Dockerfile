FROM node:20

ARG DATABASE_PROVIDER
ARG DATABASE_URL

ENV DATABASE_PROVIDER=${DATABASE_PROVIDER}
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/
COPY src ./src/

EXPOSE 3001

# Generate Prisma client at build time (reads DATABASE_PROVIDER from env)
RUN npx prisma generate

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npx prisma migrate deploy && npx tsc && node dist/index.js; else npx prisma db push --accept-data-loss && npm run dev; fi"]

