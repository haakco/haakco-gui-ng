#!/usr/bin/env bash
PATH=./node_modules/.bin/:$PATH
cd /home/node/src || exit
npm install
npm run start-docker-proxy
