FROM node:latest AS frontend
WORKDIR /frontend
COPY package.json package.json
RUN yarn
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:1.15-alpine as nginx
RUN apk add --update nodejs npm
RUN npm install dotenv
COPY /write_env.js /write_env.js
COPY --from=frontend /frontend/build /build
COPY nginx /etc/nginx/conf.d
CMD node write_env.js /build/config.js; exec nginx -g 'daemon off;'