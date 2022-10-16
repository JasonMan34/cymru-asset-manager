FROM node:16

# Create app directory
WORKDIR /api_server

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "node", "server.js" ]