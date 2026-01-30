# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock* ./
COPY services/gateway/package.json ./services/gateway/
RUN yarn install --frozen-lockfile 2>/dev/null || yarn install

COPY . .
WORKDIR /app/services/gateway
RUN yarn build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/services/gateway/package.json ./
COPY --from=builder /app/services/gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5400
ENV PORT=5400
CMD ["node", "dist/main.js"]
