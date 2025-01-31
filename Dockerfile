# Use the official Node.js image (LTS version)
FROM node:20.18.0-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json package-lock.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application for production
RUN npm run build

# Use Nginx to serve the application
FROM nginx:latest

# Copy the built application from the build stage to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Optionally, copy a custom Nginx configuration file if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]

