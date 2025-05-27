#!/bin/sh

API_BASE_URL=${VITE_API_BASE:-http://0.0.0.0:8000}
echo "Injecting API base URL: $API_BASE_URL"

find /usr/share/nginx/html/assets -type f -name "*.js" -exec \
  sed -i "s|VITE_API_BASE_PLACEHOLDER|$API_BASE_URL|g" {} \;

nginx -g "daemon off;"
