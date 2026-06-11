FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Expose the port
EXPOSE 16745

# Start the application
CMD ["npm", "start"]
