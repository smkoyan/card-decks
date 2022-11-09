# Cards Deck API

## Usage

### Steps to run
the default database dialect used here is mysql if you are planning to use something
else you should install engine driver manually required by sequelize ORM
1. clone project `git clone https://github.com/smkoyan/card-decks.git`
2. go to the project folder `cd card-decks`
3. install npm packages `npm i`
4. copy .env.example to .env `cp .env.example .env`
5. fill in the environment variables
6. create a database with the same name as in env like for mysql `CREATE DATABASE card-decks`
6. run application `npm start` or `node server.js`


### Steps to test
1. replace last command of run steps with `npm test`

## Steps with Docker
1. clone project `git clone https://github.com/smkoyan/card-decks.git`
2. go to the project folder `cd card-decks`
3. build docker image `docker build . -t <username>/<app-name>`
4. run docker image passing environment variables `docker run -p <public-port>:<private-port> -d --env-file <env-file-name> <username>/<app-name>`
