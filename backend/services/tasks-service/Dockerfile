FROM node:18-alpine

WORKDIR /app

# Install ALL dependencies (dev + prod)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Install ts-node-dev globally or use npx
RUN npm install -g ts-node-dev

EXPOSE 4000

# Use dev script
CMD ["npm", "run", "dev"]