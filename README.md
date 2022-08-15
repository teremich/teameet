# Teameet

A website to find and join interesting projects or to post your projects and find people to work with

## if you have any questions…
feel free to open an issue and ask as many of them as you want to

## getting started:
- clone the github repo
- rename the example.env file to .env and fill in the right values
- optionally change the username, password & postgresql-port in the docker-compose.yml file
- instead of running the postgresql and redis databases in a docker container you can do it yourself
- run following commands:
    - setting up the databases:
        - `docker compose up` (the easiest way to get the databases running)
    - building the backend:
        - `npm install`
        - `npx prisma generate`
        - `npm run build`
    - building the frontend:
        - `cd client`
        - `npm i --legacy-peer-deps`
        - `npm run build`
        - `cd ..`
    - running teameet:
        - `npx prisma migrate deploy`
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
