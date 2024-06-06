FROM node:18

WORKDIR /app

COPY package.json tsconfig.json yarn.lock ./
RUN yarn install

COPY ./src ./src
RUN yarn run build

CMD ["yarn", "start:prod"]