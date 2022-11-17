FROM node:alpine as base
WORKDIR /usr/src/app
COPY package*.json .

FROM base as test
RUN npm ci
COPY . .
CMD ["npm","run","test"]

FROM base as prod
RUN npm ci
COPY . .
CMD ["npm","run"]