FROM node:18.16.0-alpine

WORKDIR /usr/src/app

COPY .npmrc .npmrc
COPY package*.json ./

RUN npm install

COPY . .
ADD ./ghz /usr/local/bin
EXPOSE 3000

# Define the command to run your app
CMD ["node", "server.js"]
