#!/bin/bash
set -e

docker-compose \
  --project-name ts-bedrock\
  --file ./devops/dev/docker-compose.yml \
  --project-directory . \
  up \
  --detach \
  --build \
  --remove-orphans
