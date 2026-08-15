FROM node:20-alpine

WORKDIR /app

COPY src/shared/package*.json ./src/shared/
WORKDIR /app/src/shared
RUN npm ci --omit=dev --no-audit --no-fund

WORKDIR /app
COPY src/shared/config ./src/shared/config
COPY src/shared/middleware ./src/shared/middleware
COPY src/shared/utils ./src/shared/utils
COPY src/services/learning-path-service/package*.json ./src/services/learning-path-service/
WORKDIR /app/src/services/learning-path-service
RUN npm ci --omit=dev --no-audit --no-fund

COPY src/services/learning-path-service/src ./src/services/learning-path-service/src

EXPOSE 5181

WORKDIR /app/src/services/learning-path-service
CMD ["npm", "start"]

