#!/bin/bash
set -e

docker-compose \
  --project-name papa\
  --file ./devops/dev/docker-compose.yml \
  --project-directory . \
  up \
  --detach \
  --build \
  --remove-orphans
