FROM node:18-alpine as development

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY tsconfig.json ./
COPY nodemon.json ./
COPY src ./src
COPY .env ./
ENV PORT 3000
CMD ["npm", "run", "dev"]