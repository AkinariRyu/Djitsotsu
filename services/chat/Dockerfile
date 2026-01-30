# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock* ./
COPY services/chat/package.json ./services/chat/
RUN yarn install --frozen-lockfile 2>/dev/null || yarn install

COPY . .
WORKDIR /app/services/chat
RUN yarn build

# ---
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/services/chat/package.json ./
COPY --from=builder /app/services/chat/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5403
ENV PORT=5403
CMD ["node", "dist/main.js"]
