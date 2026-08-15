.DEFAULT_GOAL := help

NPM_BIN ?= npm
COMPOSE_BIN ?= docker compose

FRONTEND_DIR := frontend
ADMIN_DIR := admin
BACKEND_DIR := backend
SHARED_DIR := backend/src/shared
GATEWAY_DIR := backend/src/api-gateway
SERVICE_ROOT := backend/src/services

.PHONY: help install install-frontend install-admin install-backend install-shared \
	install-gateway install-services install-auth install-user install-course \
	install-blog install-enrollment install-learning-path dev dev-frontend dev-admin \
	dev-backend dev-microservices lint lint-frontend lint-admin build build-frontend \
	build-admin check preview-frontend preview-admin docker-up docker-down docker-logs

help:
	@echo "F8 Education Clone"
	@echo ""
	@echo "Setup:"
	@echo "  make install          Install all workspace dependencies"
	@echo "  make docker-up        Start MongoDB with Docker Compose"
	@echo ""
	@echo "Development:"
	@echo "  make dev              Start frontend, admin and microservices"
	@echo "  make dev-frontend     Start the learner frontend"
	@echo "  make dev-admin        Start the admin dashboard"
	@echo "  make dev-backend      Start all backend microservices"
	@echo ""
	@echo "Quality:"
	@echo "  make lint             Lint frontend and admin"
	@echo "  make build            Build frontend and admin"
	@echo "  make check            Run lint and build"

install: install-frontend install-admin install-backend install-shared install-gateway install-services

install-frontend:
	cd $(FRONTEND_DIR) && $(NPM_BIN) ci

install-admin:
	cd $(ADMIN_DIR) && $(NPM_BIN) ci

install-backend:
	cd $(BACKEND_DIR) && $(NPM_BIN) ci

install-shared:
	cd $(SHARED_DIR) && $(NPM_BIN) ci

install-gateway:
	cd $(GATEWAY_DIR) && $(NPM_BIN) ci

install-services: install-auth install-user install-course install-blog install-enrollment install-learning-path

install-auth:
	cd $(SERVICE_ROOT)/auth-service && $(NPM_BIN) ci

install-user:
	cd $(SERVICE_ROOT)/user-service && $(NPM_BIN) ci

install-course:
	cd $(SERVICE_ROOT)/course-service && $(NPM_BIN) ci

install-blog:
	cd $(SERVICE_ROOT)/blog-service && $(NPM_BIN) ci

install-enrollment:
	cd $(SERVICE_ROOT)/enrollment-service && $(NPM_BIN) ci

install-learning-path:
	cd $(SERVICE_ROOT)/learning-path-service && $(NPM_BIN) ci

dev:
	$(MAKE) -j3 dev-frontend dev-admin dev-backend

dev-frontend:
	cd $(FRONTEND_DIR) && $(NPM_BIN) run dev

dev-admin:
	cd $(ADMIN_DIR) && $(NPM_BIN) run dev

dev-backend: dev-microservices

dev-microservices:
	cd $(BACKEND_DIR) && $(NPM_BIN) run dev:microservices

lint: lint-frontend lint-admin

lint-frontend:
	cd $(FRONTEND_DIR) && $(NPM_BIN) run lint

lint-admin:
	cd $(ADMIN_DIR) && $(NPM_BIN) run lint

build: build-frontend build-admin

build-frontend:
	cd $(FRONTEND_DIR) && $(NPM_BIN) run build

build-admin:
	cd $(ADMIN_DIR) && $(NPM_BIN) run build

check: lint build

preview-frontend:
	cd $(FRONTEND_DIR) && $(NPM_BIN) run preview

preview-admin:
	cd $(ADMIN_DIR) && $(NPM_BIN) run preview

docker-up:
	$(COMPOSE_BIN) up -d mongodb

docker-down:
	$(COMPOSE_BIN) down

docker-logs:
	$(COMPOSE_BIN) logs -f mongodb
