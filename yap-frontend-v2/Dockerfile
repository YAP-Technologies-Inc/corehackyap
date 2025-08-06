FROM node:18-alpine

# Set working directory
WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_TOKEN_ADDRESS
ARG NEXT_PUBLIC_NETWORK_ID
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ELEVENLABS_VOICE_ID

# Set environment variables
ENV NEXT_PUBLIC_TOKEN_ADDRESS=$NEXT_PUBLIC_TOKEN_ADDRESS
ENV NEXT_PUBLIC_NETWORK_ID=$NEXT_PUBLIC_NETWORK_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ELEVENLABS_VOICE_ID=$NEXT_PUBLIC_ELEVENLABS_VOICE_ID

# Install dependencies
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["npm", "start"] 