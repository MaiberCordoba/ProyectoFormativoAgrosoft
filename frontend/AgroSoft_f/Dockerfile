# Etapa 1: Build de la app con Vite
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar solo los archivos necesarios primero (para aprovechar caché)
COPY package*.json ./
#nuevo
COPY .env .env 
COPY .npmrc .npmrc

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Ejecutar el build (esto generará la carpeta dist/)
RUN npm run build

# Etapa 2: Servir los archivos con Nginx
FROM nginx:alpine

# Eliminar la configuración por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar el resultado del build a la carpeta pública de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada-nuevo
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Exponer el puerto 80
EXPOSE 80

# Arranca Nginx (ya viene con CMD por defecto)
