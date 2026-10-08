# ETAPA 1: Compilar Frontend React/Vite
FROM node:20-bookworm-slim AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ .
# VITE_API_URL vacío para que use rutas relativas mágicamente
ENV VITE_API_URL=""
RUN npm run build

# ETAPA 2: Preparar Backend unificado
FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends postgresql postgresql-client \
	&& rm -rf /var/lib/apt/lists/*

# Instalar dependencias del Backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Copiar el Frontend compilado a la carpeta public del backend
COPY --from=frontend-builder /app/dist ./public

# TRUCO MÁGICO: Inyectar Express para que sirva el Frontend compilado sin tocar tu código
RUN sed -i 's/app.listen/app.use(express.static("public"));\napp.get("*", (req, res) => res.sendFile(path.join(__dirname, "..", "public", "index.html")));\napp.listen/g' src/index.js

# Preparar carpetas, permisos y el arranque de los dos procesos.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
	&& mkdir -p /app/uploads /var/lib/postgresql/data \
	&& chown -R node:node /app/uploads \
	&& chown -R postgres:postgres /var/lib/postgresql/data

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "src/index.js"]