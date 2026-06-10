# ============================================================
# Stage 1: builder — build the Next.js standalone server
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY .env .env
RUN npm install

# Copy source code
COPY . .

# Build and export standalone server
RUN npm run build

# ============================================================
# Stage 2: runner — serve Next.js standalone
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

# Copy the public directory (if you have static assets)
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 80

CMD ["node", "server.js"]