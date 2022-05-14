FROM node:16.15

ARG PORT=4000
# ARG CMD_RUN_DEV='npm run start:dev'
# ARG CMD_RUN_PROD='npm run start:prod'

WORKDIR /app
COPY package*.json ./
RUN npm config set registry http://registry.npmjs.org/
RUN npm install
COPY . .
EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]