FROM node:20-alpine

WORKDIR /app

COPY src/api-gateway/package*.json ./src/api-gateway/
WORKDIR /app/src/api-gateway
RUN npm ci --omit=dev --no-audit --no-fund

WORKDIR /app
COPY src/api-gateway/src ./src/api-gateway/src

EXPOSE 5175

WORKDIR /app/src/api-gateway
CMD ["npm", "start"]

