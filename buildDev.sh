#!/usr/bin/env bash
IMAGE_NAME=haakco/haakco-gui-ng-dev
docker build --pull --rm --file Dockerfile.dev -t "${IMAGE_NAME}" .
