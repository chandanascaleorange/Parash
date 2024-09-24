# Use the official Node.js image with Alpine Linux
FROM node:alpine

# Set the working directory inside the container
WORKDIR /Backend

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Install nodemon globally
RUN npm install -g nodemon

RUN chmod +x ./wait-for-it.sh
# Install PostgreSQL client utilities
RUN apk add --no-cache postgresql-client
RUN apk add --no-cache bash

# Expose the port on which the app will run
EXPOSE 4000

# Command to run the app in development mode
CMD ["./wait-for-it.sh", "postgres-db", "--", "npm", "run", "dev"]
