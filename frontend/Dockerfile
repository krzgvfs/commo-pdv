# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
# This is done separately to leverage Docker cache. 
# The dependencies will only be re-installed if package.json or package-lock.json changes.
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Run the application
# The source code will be mounted from the host, enabling hot-reload.
CMD ["npm", "run", "dev"]