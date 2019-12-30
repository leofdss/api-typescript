FROM node:10.13-alpine
ENV NODE_ENV production
ENV PORT 3030
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "tsconfig.json","tsconfig.prod.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
RUN npm install -g forever
COPY . .
RUN npm run build
EXPOSE 3030
CMD forever -r module-alias/register ./dist/index.js

# sudo docker-compose -f "docker-compose.yml" up -d --build
