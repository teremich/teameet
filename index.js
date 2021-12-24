require('dotenv').config(); // Load environment variables from .env file
const Server = require('./models/server');
const Database = require("./models/database");
const server = new Server();
const database = new Database();
server.listen();
server.app.use(database.routes, database.middleware);