FROM node:lts-bookworm-slim

WORKDIR /src

COPY package*.json tsconfig.json ./

RUN npm ci --production && npm cache clean --force

COPY src .

EXPOSE 8000

CMD ["npm","run","start"]