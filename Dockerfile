ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} 

WORKDIR /backend

COPY package*.json .
RUN npm ci 

COPY prisma ./prisma 
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
