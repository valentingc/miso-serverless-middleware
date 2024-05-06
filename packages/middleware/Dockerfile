# Base image
FROM node:18.16.0-alpine AS build

# Create app directory
WORKDIR /usr/src/app

COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.base.json ./tsconfig.base.json
COPY ./packages/middleware/package*.json ./packages/middleware/
COPY .npmrc ./packages/middleware/.npmrc

# Install app dependencies
WORKDIR /usr/src/app/packages/middleware
RUN npm install

COPY ./packages/middleware .

# Bundle app source
RUN npm run build

USER node

EXPOSE 3000 
EXPOSE 5001

# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]
