# Use a specific Node.js version
FROM node:20.16.0

# Set working directory inside the container
WORKDIR /app

# Copy only the package files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY index-exp.js ./
COPY private_key.pem ./

# Expose the port your app listens on
EXPOSE 3001

# Define the command to run your app
CMD ["node", "index-exp.js"]
