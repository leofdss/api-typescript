FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install --production --silent
RUN npm run build
RUN npm install forever -g
COPY . .
EXPOSE 3000
CMD forever ./dist/index.js

# sudo docker build -t server .
# sudo docker run -p 3000:3000 server

# sudo docker-compose -f "docker-compose.yml" up -d --build
