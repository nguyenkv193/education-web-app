FROM node:20-alpine

WORKDIR /app

COPY src/shared/package*.json ./src/shared/
WORKDIR /app/src/shared
RUN npm ci --omit=dev --no-audit --no-fund

WORKDIR /app
COPY src/shared/config ./src/shared/config
COPY src/shared/middleware ./src/shared/middleware
COPY src/shared/utils ./src/shared/utils
COPY src/services/enrollment-service/package*.json ./src/services/enrollment-service/
WORKDIR /app/src/services/enrollment-service
RUN npm ci --omit=dev --no-audit --no-fund

COPY src/services/enrollment-service/src ./src/services/enrollment-service/src

EXPOSE 5180

WORKDIR /app/src/services/enrollment-service
CMD ["npm", "start"]

