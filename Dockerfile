# ----------------------------------------------------------------------
# COMPILE REACT APP
# ----------------------------------------------------------------------
FROM node:14 AS frontend

WORKDIR /frontend

COPY package.json yarn.lock /frontend/
RUN yarn && yarn install

COPY jsconfig.json .
COPY public/ public/
COPY src/ src/

RUN yarn build

# ----------------------------------------------------------------------
# FINAL IMAGE
# ----------------------------------------------------------------------
FROM nginx:alpine

ARG BRANCH="unknown"
ARG BUILDNUMBER="local"
ARG GITSHA1="unknown"

COPY --from=frontend /frontend/build /usr/share/nginx/html
COPY config.template /config.template

ENV BRANCH="${BRANCH}" \
    BUILDNUMBER="${BUILDNUMBER}" \
    GITSHA1="${GITSHA1}" \
    REACT_APP_FRONTEND_COMMIT_ENDPOINT="https://api.github.com/repos/classtranscribe/Frontend/commits/master" \
    AUTH0_CLIENT_ID="" \
    AUTH0_DOMAIN="" \
    CILOGON_CLIENT_ID="" \
    APPLICATION_INSIGHTS_KEY="" \
    TEST_SIGN_IN=""

CMD envsubst < /config.template > /usr/share/nginx/html/config.js && nginx -g 'daemon off;'
