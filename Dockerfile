# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set build-time arguments as environment variables
ARG REACT_APP_TWITCH_CLIENT_ID
ENV REACT_APP_TWITCH_CLIENT_ID=$REACT_APP_TWITCH_CLIENT_ID

ARG REACT_APP_TWITCH_CLIENT_SECRET
ENV REACT_APP_TWITCH_CLIENT_SECRET=$REACT_APP_TWITCH_CLIENT_SECRET

# Build the application
# Note: The .env file with REACT_APP_TWITCH_CLIENT_ID and REACT_APP_TWITCH_CLIENT_SECRET
# needs to be present in this directory when building the image
# so that the build process can embed them.
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built application from the 'build' stage to Nginx's web root directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration file
# This is important to handle client-side routing in React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for incoming traffic
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
