FROM haakco/haakco-gui-ng-dev:latest as node_builder

ENV LANG="en_US.UTF-8" \
    LC_ALL="C.UTF-8" \
    LANGUAGE="en_US.UTF-8" \
    TERM="xterm"

RUN mkdir -p /home/node/.npm-global && \
    rm -rf /home/node/src/* && \
    npm set progress=false

ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

## Cleanout previous dev just in case
RUN rm -rf /home/node/src/*

ADD . /home/node/src

WORKDIR /home/node/src

RUN npm install -g \
      @angular/cli@latest

RUN cd /home/node/src && \
    PATH=./node_modules/.bin/:$PATH && \
    npm --unsafe-perm ci --prefer-offline

RUN npm run build

FROM haakco/nginx-alpine

COPY --from=0 /home/node/src/dist/haakco-gui-ng /nginx/nginx_config/site
