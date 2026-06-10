# ============================================================
# Stage 1: deps — install only production dependencies
# ============================================================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json ./
COPY .env .env

# Use npm install as fallback when no lockfile exists
RUN npm install --omit=dev

# ============================================================
# Stage 2: builder — build the Next.js static export
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY .env .env
RUN npm install

# Copy source code
COPY . .

# Build and export static files into /app/out
RUN npm run build

# ============================================================
# Stage 3: runner — serve static files with Nginx (minimal)
# ============================================================
FROM nginx:1.27-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/out /usr/share/nginx/html
COPY .github/workflows/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]