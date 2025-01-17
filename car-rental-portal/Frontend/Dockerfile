# Use the official Node.js image as the base image
FROM node:latest AS build

# Set the working directory
WORKDIR /opt/source/car-rental-portal

# Copy the source code into the working directory
COPY . .

# Configure npm registry
RUN npm config set registry https://registry.npmjs.org/

# Install the dependencies
RUN npm install

# Install the Angular CLI globally
RUN npm install -g @angular/cli

# Build the application
RUN ng build --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:1.25.4-alpine

# Copy the built application from the build stage
COPY --from=build /opt/source/car-rental-portal/dist/car-rental/browser /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 4200
EXPOSE 4200
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

