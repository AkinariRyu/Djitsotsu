# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock* ./
COPY services/voice/package.json ./services/voice/
RUN yarn install --frozen-lockfile 2>/dev/null || yarn install

COPY . .
WORKDIR /app/services/voice
RUN yarn build

# ---
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/services/voice/package.json ./
COPY --from=builder /app/services/voice/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5404
ENV PORT=5404
CMD ["node", "dist/main.js"]
