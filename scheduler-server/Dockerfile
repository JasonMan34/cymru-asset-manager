FROM node:16

# Create app directory
WORKDIR /scheduler

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

CMD [ "node", "server.js" ]