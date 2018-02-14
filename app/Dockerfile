FROM node:8.9.4

WORKDIR /app

ENV PORT=80

EXPOSE 80

ADD index.js /app
ADD package.json /app

RUN npm install --silent

CMD ["node", "index.js"]
