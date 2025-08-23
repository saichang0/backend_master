# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build TypeScript
RUN npm run build

# Start the app
CMD ["npm", "run", "start"]