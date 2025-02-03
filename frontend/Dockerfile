# Use Node.js to build the frontend
FROM node:20 AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the app and build it
COPY . .
RUN npm run build

# Use a lightweight Nginx server to serve React
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy React build files
COPY --from=builder /app/dist ./

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
