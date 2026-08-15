FROM node:20-alpine

WORKDIR /app

COPY src/shared/package*.json ./src/shared/
WORKDIR /app/src/shared
RUN npm ci --omit=dev --no-audit --no-fund

WORKDIR /app
COPY src/shared/config ./src/shared/config
COPY src/shared/middleware ./src/shared/middleware
COPY src/shared/utils ./src/shared/utils
COPY src/services/user-service/package*.json ./src/services/user-service/
WORKDIR /app/src/services/user-service
RUN npm ci --omit=dev --no-audit --no-fund

COPY src/services/user-service/src ./src/services/user-service/src

EXPOSE 5177

WORKDIR /app/src/services/user-service
CMD ["npm", "start"]

