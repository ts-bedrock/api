#!/bin/bash
set -e

echo "🌡  Running migration for development database:"
export NODE_ENV=development
# shellcheck disable=SC1091
source .env.dev
ts-node ./migrations/index.ts

echo
echo "🧪 Running migration for test database:"
export NODE_ENV=test
# shellcheck disable=SC1091
source .env.test
ts-node ./migrations/index.ts

echo
echo "🏁 Database migration completed."
