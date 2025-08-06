FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN apt-get update && \
        apt-get install -y nginx && \
        apt-get clean && \
        rm -rf /var/lib/apt/lists/*

RUN find . -mindepth 1 \
    ! -name 'dist' \
    ! -name 'entrypoint.sh' \
    ! -path './dist/*' \
    -ignore_readdir_race \
    -exec rm -rf {} + || true


RUN chmod +x ./entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]
