# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S react -u 1001

# Set permissions
RUN chown -R react:nodejs /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

USER react

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]