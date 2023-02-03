FROM node:18-alpine as development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY nodemon.json ./
COPY src ./src
COPY .env ./

CMD ["npm", "run", "dev"]