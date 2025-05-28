FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

RUN VITE_API_BASE=$VITE_API_BASE npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY bin/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY bin/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh
RUN apk add --no-cache gettext

ENTRYPOINT ["/entrypoint.sh"]
