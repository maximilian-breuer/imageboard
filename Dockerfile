# syntax=docker/dockerfile:1
# build application

FROM node:17-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY backend/package.json /app/backend/package.json
COPY angular-client/package.json /app/angular-client/package.json
RUN npm install
WORKDIR /app/angular-client
RUN npm install
WORKDIR /app/backend
RUN npm install

WORKDIR /app
COPY . /app
RUN sed -i s/127.0.0.1/mongo-db/ backend/src/config.json
RUN npm run build

EXPOSE 3000
RUN mkdir -p images
VOLUME /app/images
CMD ["node","/app/backend/build/server.js"]
