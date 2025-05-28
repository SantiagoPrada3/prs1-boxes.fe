# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Crear directorio de la app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Generar build de producción
RUN npm run build --prod

# Etapa 2: Servir la app con Nginx
FROM nginx:alpine

# Copiar los archivos de build al contenedor de nginx
COPY --from=builder /app/dist/bases /usr/share/nginx/html

# Copiar configuración personalizada de nginx si tienes una
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
