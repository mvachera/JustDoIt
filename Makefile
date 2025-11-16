.PHONY: up down build logs clean test restart

up:
	@echo "🚀 Lancement de JustDoIt..."
	docker compose up -d
	@echo "✅ Services lancés ! Frontend: http://localhost:8080 | Backend: http://localhost:5000"

dev:
	@echo "🔧 Mode développement (Backend Docker + Frontend local)"
	@docker compose up backend & cd frontend && npm run dev
	@echo "✅ Services lancés ! Frontend: http://localhost:5173 | Backend: http://localhost:5000"

down:
	@echo "🛑 Arrêt des services..."
	docker compose down

build:
	@echo "🔨 Rebuild des images..."
	docker compose build --no-cache

logs:
	docker compose logs -f

clean:
	@echo "⚠️  Suppression complète des services..."
	docker compose down --rmi all --remove-orphans
	docker system prune -a -f

restart:
	@echo "🔄 Redémarrage..."
	docker compose restart

help:
	@echo "Commandes disponibles :"
	@echo "  make (up)    - Lance tous les services"
	@echo "  make down    - Arrête tous les services"
	@echo "  make build   - Rebuild les images"
	@echo "  make logs    - Affiche les logs"
	@echo "  make clean   - Supprime tout"
	@echo "  make restart - Redémarre les services"
	@echo "  make test    - Lance les tests"