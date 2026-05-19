# =============================================================
# Stage 1 - Build do frontend com Vite
# =============================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas os manifestos primeiro para aproveitar o cache do Docker
COPY package.json package-lock.json ./

RUN npm ci --prefer-offline

# Copia o restante do código-fonte
COPY . .

# Gera o bundle de produção do Vite
RUN npm run build

# =============================================================
# Stage 2 - Servidor nginx leve para produção
# =============================================================
FROM nginx:1.27-alpine

# Remove a configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada (SPA routing + proxy /api -> backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos gerados pelo build do Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]