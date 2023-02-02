FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./

COPY src ./src
COPY .env ./

CMD ["npm", "run", "dev"]