FROM node:20

WORKDIR /app

COPY . /app

RUN yarn 

ENTRYPOINT ["/bin/sh", "-c" , "yarn build && yarn start -p 5216"]