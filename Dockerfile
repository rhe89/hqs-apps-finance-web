FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

RUN addgroup -g 1001 -S nodejs && adduser -S svelte -u 1001
RUN mkdir -p /data && chown svelte:nodejs /data

USER svelte

EXPOSE 3000
ENV PORT=3000
ENV BODY_SIZE_LIMIT=1M

CMD ["node", "build"]
