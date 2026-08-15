FROM node:20-alpine

WORKDIR /app

COPY src/shared/package*.json ./src/shared/
WORKDIR /app/src/shared
RUN npm ci --omit=dev --no-audit --no-fund

WORKDIR /app
COPY src/shared/config ./src/shared/config
COPY src/shared/middleware ./src/shared/middleware
COPY src/shared/utils ./src/shared/utils
COPY src/services/auth-service/package*.json ./src/services/auth-service/
WORKDIR /app/src/services/auth-service
RUN npm ci --omit=dev --no-audit --no-fund

COPY src/services/auth-service/src ./src/services/auth-service/src

EXPOSE 5176

WORKDIR /app/src/services/auth-service
CMD ["npm", "start"]

