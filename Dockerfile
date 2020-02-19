FROM node:latest AS frontend
WORKDIR /frontend
COPY package.json package.json
RUN yarn
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:1.15-alpine as nginx
RUN apk add --update nodejs npm
COPY /nginx/write_env.js /write_env.js
COPY --from=frontend /frontend/build /build