# Documentation Site Dockerfile
# Serves static documentation at docs.lanonasis.com

FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json bun.lock ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build documentation site
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built documentation
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder stage
COPY --from=build /app/build /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
