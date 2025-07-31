FROM python:3.12.11-alpine3.22
# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    build-base \
    postgresql-dev

# Copiar requirements e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto
COPY . .

# Crear carpeta para archivos estáticos
RUN mkdir -p /app/static

# Recolectar archivos estáticos de Django
RUN python manage.py collectstatic --noinput

# Exponer el puerto de desarrollo de Django
EXPOSE 8000