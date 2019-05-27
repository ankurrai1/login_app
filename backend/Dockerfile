FROM node:10

RUN mkdir -p backend/app

WORKDIR /backend/app

COPY package.json backend/app

RUN npm install

COPY . /backend/app

EXPOSE 9000

CMD [ "npm","start" ]
