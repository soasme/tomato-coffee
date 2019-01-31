FROM node:11.8.0 as build-stage

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN ls . && npm run build

FROM nginx:1.15.8

COPY --from=build-stage /app/build /usr/share/nginx/html
