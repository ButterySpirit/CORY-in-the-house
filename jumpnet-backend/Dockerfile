# Base image
FROM node:20

# Set working directory
WORKDIR /app


# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the backend port
EXPOSE 3000

# Command to start the app
CMD ["node", "index.js"]
