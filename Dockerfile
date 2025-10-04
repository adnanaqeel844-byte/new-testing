
FROM node:18-alpine
WORKDIR /app

# copy package files and install server deps
COPY package.json package-lock.json* ./
RUN npm install --production

# copy server + client source
COPY server ./server
COPY client ./client

# build client
RUN cd client && npm install && npm run build

EXPOSE 10000
CMD ["node", "server/index.js"]