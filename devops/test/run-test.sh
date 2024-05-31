#!/bin/bash
set -e

# shellcheck disable=SC1091
source .env.test
./node_modules/.bin/tsc

# "$@" will expands to all arguments passed to this script
jest "$@"
