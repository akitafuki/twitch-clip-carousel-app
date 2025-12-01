# Stage 1: Build the React application
FROM node:24-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set build-time arguments as environment variables
ARG VITE_TWITCH_CLIENT_ID
ENV VITE_TWITCH_CLIENT_ID=$VITE_TWITCH_CLIENT_ID

ARG VITE_TWITCH_CLIENT_SECRET
ENV VITE_TWITCH_CLIENT_SECRET=$VITE_TWITCH_CLIENT_SECRET

# Build the application
# Note: The .env file with VITE_TWITCH_CLIENT_ID and VITE_TWITCH_CLIENT_SECRET
# needs to be present in this directory when building the image
# so that the build process can embed them.
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built application from the 'build' stage to Nginx's web root directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration file
# This is important to handle client-side routing in React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for incoming traffic
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
