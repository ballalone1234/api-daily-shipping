# Use a specific Node.js version for consistency
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Create a non-root user and group
RUN addgroup -S your-project-group && adduser -S smart -G your-project-group

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the application code
COPY . /usr/src/app

# Change ownership of the application directory
RUN chown -R smart:your-project-group /usr/src/app

# Switch to the non-root user
USER smart

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]