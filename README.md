# Teameet

A website to find and join interesting projects or to post your projects and find people to work with

## if you have any questions…
feel free to open an issue and ask as many of them as you want to

## getting started:
- clone the github repo
- rename the example.env file to .env and fill in the right values
- optionally change the username, password & postgresql-port in the docker-compose.yml file
- instead of running the postgresql and redis databases in a docker container you can set it up yourself
- run following commands:
    - setting up the databases:
        - `docker compose up` (the easiest way to get the databases running)
    - building the backend:
        - (beware of the node version in the .nvmrc file)
        - `npm install`
        - `npx prisma generate`
        - `npm run build`
    - building the frontend:
        - (beware of the node version in the .nvmrc file)
        - `cd client`
        - `npm i --legacy-peer-deps`
        - `npm run build`
        - `cd ..`
    - running teameet:
        - (cwd is the project root)
        - `npx prisma migrate deploy`
        - `npm start`
- now you have a porduction build of teameet
- for development use `npm run dev` in the root folder and `npm run serve` in the client folder

## TODO:
- find bugs and fix them
- Front end:
    - finish the web pages
- Back end:
    - project crud
    - features like baning/kicking users or leaving projects
    - Testing: user crud and joining projects

## TODO post v1.0 update:
- Front end:
    - make the pages more beautiful
    - update the api paths (v1 :D)
    - make it usable on mobile
    - implement all possible error messages
- documentation:
    - api
    - project (optional)
