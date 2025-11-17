# ================================
# Étape 1 : Build (Compilation TypeScript)
# ================================
FROM node:20-alpine AS builder

# Définir le dossier de travail dans le container
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (y compris devDependencies pour build)
RUN npm ci

# Copier tout le code source
COPY . .

# Compiler TypeScript en JavaScript (npm run build = tsc)
RUN npm run build

# ================================
# Étape 2 : Image de production (multi-stage build)
# ================================
FROM node:20-alpine

WORKDIR /app

# Copier seulement package*.json
COPY package*.json package-lock.json* ./

# Installer SEULEMENT les dépendances de production (pas les dev)
RUN npm ci --only=production

# Copier le code compilé depuis l'étape builder
COPY --from=builder /app/dist ./dist

# Copier le dossier uploads si tu en as un (optionnel)
# COPY --from=builder /app/uploads ./uploads

# Exposer le port 5000
EXPOSE 5000

# Healthcheck pour vérifier que l'application backend fonctionne
# Vérifie toutes les 30s si l'endpoint /health répond avec un code 200
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Lancer l'application (npm start = node dist/server.js)
CMD ["npm", "start"]