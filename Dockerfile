FROM node:10.13-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "tsconfig.json","tsconfig.prod.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent
RUN npm install -g forever
RUN npm install -g typescript
COPY . .
RUN npm run build
EXPOSE 3030
ENV PORT 3030
ENV NODE_ENV production
CMD forever ./dist/index.js

# sudo docker-compose -f "docker-compose.yml" up -d --build
