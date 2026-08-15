FROM node:20-alpine

WORKDIR /app

COPY src/shared/package*.json ./src/shared/
WORKDIR /app/src/shared
RUN npm ci --omit=dev --no-audit --no-fund

WORKDIR /app
COPY src/shared/config ./src/shared/config
COPY src/shared/middleware ./src/shared/middleware
COPY src/shared/utils ./src/shared/utils
COPY src/services/course-service/package*.json ./src/services/course-service/
WORKDIR /app/src/services/course-service
RUN npm ci --omit=dev --no-audit --no-fund

COPY src/services/course-service/src ./src/services/course-service/src

EXPOSE 5178

WORKDIR /app/src/services/course-service
CMD ["npm", "start"]

