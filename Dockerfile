FROM registry.haak.co/geek-gui-ng-dev:latest as node_builder

## Cleanout previous dev just in case
RUN rm -rf /home/node/src/*
RUN rm -rf /home/node/.npm-global/lib/*

ADD . /home/node/src

WORKDIR /home/node/src

RUN npm --unsafe-perm ci --prefer-offline
RUN npm run prod

FROM haakco/nginx-alpine

COPY --from=0 /home/node/src/dist/geek-gui-ng /nginx/nginx_config/site
