FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --save-dev prisma dotenv

COPY . .

RUN npx prisma generate


COPY entrypoint.sh /app/entrypoint.sh

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
# Pour la production, build puis start
RUN npm run build
CMD ["npm", "start"]