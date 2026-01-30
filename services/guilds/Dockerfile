# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock* ./
COPY services/guilds/package.json ./services/guilds/
RUN yarn install --frozen-lockfile 2>/dev/null || yarn install

COPY . .
WORKDIR /app/services/guilds
RUN yarn build

# ---
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/services/guilds/package.json ./
COPY --from=builder /app/services/guilds/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5402
ENV PORT=5402
CMD ["node", "dist/main.js"]
