FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm install --save-dev prisma dotenv

EXPOSE 3000

CMD sh -c "npx prisma generate && npx prisma migrate dev --name init && npx prisma db seed && node /app/mongodb/db.js && npm run dev"