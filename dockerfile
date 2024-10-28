# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Build Next.js application
RUN npm run build

# Expose both ports for WebSocket (8080) and Next.js (3000)
EXPOSE 3000 8080

# Start both the Next.js and WebSocket servers
CMD ["npx", "concurrently", "npm:start", "node websocketServer.cjs"]
