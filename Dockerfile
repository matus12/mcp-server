# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

########################################
# Base image
########################################
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

########################################
# Builder: install dev deps and build TypeScript
########################################
FROM base AS builder
ENV NODE_ENV=development
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

########################################
# Deps: install only production deps
########################################
FROM base AS deps
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

########################################
# Runtime: minimal, non-root, signal-safe
########################################
FROM node:${NODE_VERSION}-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user with fixed UID/GID (good for K8s/Azure)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app
ENV NODE_ENV=production

# Copy production node_modules
COPY --chown=nodejs:nodejs --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --chown=nodejs:nodejs --from=builder /app/build ./build

# Copy package.json (for version info) and any runtime configs
COPY --chown=nodejs:nodejs package.json ./package.json
COPY --chown=nodejs:nodejs biome.json ./biome.json

# Switch to non-root user
USER nodejs

# Default port (can be overridden)
EXPOSE 3001

# Default environment variables
ENV PORT=3001 \
    TRANSPORT=sse

# Use dumb-init to handle signals, run Node by default
ENTRYPOINT ["dumb-init", "--"]

# Default command (can be overridden at runtime)
CMD ["node", "build/bin.js", "sse"]