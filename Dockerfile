FROM node:22-slim as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
WORKDIR /app
COPY --from=build /app/dist/rss-angular/browser /app
COPY Caddyfile /etc/caddy
EXPOSE 80
EXPOSE 443/tcp
EXPOSE 443/udp
