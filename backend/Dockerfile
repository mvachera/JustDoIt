# Étape 1 : Partir d'une image de base avec Node.js
FROM node:20-alpine AS builder

# Étape 2 : Définir le dossier de travail dans le container
WORKDIR /app

# Étape 3 : Copier les fichiers de dépendances
COPY package*.json ./

# Étape 4 : Installer toutes les dépendances (y compris devDependencies pour build)
RUN npm ci

# Étape 5 : Copier tout le code source
COPY . .

# Étape 6 : Compiler TypeScript en JavaScript (npm run build = tsc)
RUN npm run build

# ================================
# Étape 7 : Image de production (multi-stage build)
# ================================
FROM node:20-alpine

WORKDIR /app

# Copier seulement package*.json
COPY package*.json ./

# Installer SEULEMENT les dépendances de production (pas les dev)
RUN npm ci --only=production

# Copier le code compilé depuis l'étape builder
COPY --from=builder /app/dist ./dist

# Copier le dossier uploads si tu en as un
# COPY --from=builder /app/uploads ./uploads

# Exposer le port 5000
EXPOSE 5000

# Lancer l'application (npm start = node dist/server.js)
CMD ["npm", "start"]