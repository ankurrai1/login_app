FROM node:10

RUN mkdir -p /client/app

WORKDIR /client/app

COPY package.json /client/app

RUN npm install

COPY . /client/app

EXPOSE 4200

CMD ["npm","start"]