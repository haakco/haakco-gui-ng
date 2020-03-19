#!/usr/bin/env bash
IMAGE_NAME=haakco/haakco-gui-ng
docker build --pull --rm -t "${IMAGE_NAME}" .
