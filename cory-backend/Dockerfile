# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (to optimize layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --only=production  # ✅ Install only production dependencies

# Copy the rest of the application files
COPY . .

# Expose the backend port
EXPOSE 3000

# Define environment variables explicitly (optional)
ENV NODE_ENV=production

# Start the app
CMD ["node", "index.js"]