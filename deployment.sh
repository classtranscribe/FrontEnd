#!/bin/bash

#The absolute path to the `Deployment` repo
DEPLOYMENT_DIR="/Users/airquizemacpro/git/class-transcribe/Deployment"
cd $DEPLOYMENT_DIR

# the first arg can be `staging` or `prod`
case $1 in
  prod)
    docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml build frontend && \
    docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml push frontend
    ;;
  staging)
    docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml -f ./docker-compose.staging.yml build frontend && \
    docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml -f ./docker-compose.staging.yml push frontend
    ;;
esac