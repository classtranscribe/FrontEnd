# ----------------------------------------------------------------------
# COMPILE REACT APP
# ----------------------------------------------------------------------
FROM node:18 AS frontend

WORKDIR /frontend

COPY package.json yarn.lock  getDefaultConfig.js changeBackend.js /frontend/
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

COPY --from=frontend /frontend/build /build/
COPY config.template /config.template
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV BRANCH="${BRANCH}" \
    BUILDNUMBER="${BUILDNUMBER}" \
    GITSHA1="${GITSHA1}" \
    AUTH0_CLIENT_ID="" \
    AUTH0_DOMAIN="" \
    CILOGON_CLIENT_ID="" \
    APPLICATION_INSIGHTS_KEY="" \
    TEST_SIGN_IN=""
# REACT_APP_FRONTEND_COMMIT_ENDPOINT="https://api.github.com/repos/classtranscribe/Frontend/commits/main" \

# If MAINTENANCE_WARNING_BANNER a warning banner is shown on the home page
# MAINTENANCE_WARNING_BANNER="ClassTranscribe will be down for maintenance on Saturday 6am for 1 hour." \

# If CLASSTRANSCRIBE_DOWN_MESSAGE is set to a non-empty string, the frontend will display a message to the user and the app cannot be started
# CLASSTRANSCRIBE_DOWN_MESSAGE="ClassTranscribe is currently down for maintenance. Please try again later." \
    
CMD envsubst < /config.template > /build/config.js && nginx -g 'daemon off;'
