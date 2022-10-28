FROM node:14.17

ARG PORT=4000

WORKDIR /app
COPY package*.json ./
# RUN npm config set registry http://registry.npmjs.org/
RUN npm install
COPY . .
COPY ./dist ./dist

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]