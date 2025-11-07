# Step 1: Use the official Node.js image
FROM node:18 AS base

# Step 2: Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Step 3: Set the working directory to the root of the project (current directory)
WORKDIR /usr/src/app

# Step 4: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 5: Install dependencies
RUN npm install

# Step 6: Copy all the project files into the container
COPY . .

# Step 7: Build the app (for TypeScript)
RUN npx prisma generate && npm run build

# Step 8: Expose the application port (optional)
EXPOSE 8000

# Step 9: Start the application
CMD ["npm", "start"]
