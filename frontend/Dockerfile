# ================================
# Étape 1 : Build (Compilation)
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances
RUN npm ci

# Copier tout le code source
COPY . .

# Build le projet Vite (tsc -b && vite build)
# Crée le dossier dist/ avec les fichiers HTML/CSS/JS optimisés
RUN npm run build

# ================================
# Étape 2 : Production avec Nginx
# ================================
FROM nginx:alpine

# Copier les fichiers buildés depuis l'étape builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Nginx démarre automatiquement (pas besoin de CMD)