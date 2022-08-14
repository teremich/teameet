# Teameet

A website to find and join interesting projects or to post your projects and find people to work with

## How to get started:
- clone the github repo
- rename the example.env file to .env and fill in the right values
- optionally change the username, password & postgresql-port in the docker-compose.yml file
- run following commands:
    - `docker compose up`
    - `npm install`
    - `npx prisma generate`
    - `npm run build`
    - `cd client`
    - `npm i --legacy-peer-deps`
    - `npm run build`
    - `cd ..`
    - `npm start`
- now you have a porduction build of teameet
- for development use `npm run dev` in the root folder and `npm run serve` in the client folder

## TODO:
- Front end
- Back end:
    - testing user crud
    - project crud
    - joining projects
    - features like baning/kicking users or leaving projects
- documentation
