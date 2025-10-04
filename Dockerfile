# ==============================
# 🏗️ Stage 1 — Build Stage
# ==============================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm ci for clean install)
RUN npm ci --only=production

# Copy source code
COPY . .

# ==============================
# 🚀 Stage 2 — Runtime Stage
# ==============================
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built app from builder
COPY --from=builder /app /app

# Copy environment file (optional, for local builds)
# In Render or Docker Compose, .env is automatically injected
# COPY .env .env

# Expose the app port (matches .env PORT)
EXPOSE ${PORT}

# Default environment
ENV NODE_ENV=production

# Run the app
CMD ["npm", "start"]