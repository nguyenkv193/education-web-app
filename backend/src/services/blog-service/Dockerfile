FROM node:20-alpine

WORKDIR /app

COPY src/shared/package*.json ./src/shared/
WORKDIR /app/src/shared
RUN npm ci --omit=dev --no-audit --no-fund

WORKDIR /app
COPY src/shared/config ./src/shared/config
COPY src/shared/middleware ./src/shared/middleware
COPY src/shared/utils ./src/shared/utils
COPY src/services/blog-service/package*.json ./src/services/blog-service/
WORKDIR /app/src/services/blog-service
RUN npm ci --omit=dev --no-audit --no-fund

COPY src/services/blog-service/src ./src/services/blog-service/src

EXPOSE 5179

WORKDIR /app/src/services/blog-service
CMD ["npm", "start"]

