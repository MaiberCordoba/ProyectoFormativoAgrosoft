# Etapa 1: solo si quieres generar la build dentro del contenedor (opcional)
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# Etapa final: usar un servidor estático para servir dist/
FROM node:18-alpine

# Instala un servidor estático ligero (serve)
RUN npm install -g serve

# Crea directorio de trabajo
WORKDIR /app

# Copia solo la carpeta ya generada
COPY dist ./dist

# Expone el puerto
EXPOSE 4322

# Comando para servir el contenido
CMD ["serve", "-s", "dist", "-l", "4322"]
