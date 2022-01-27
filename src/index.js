require('dotenv').config(); // Load environment variables from .env file
const Server = require('../models/server');
const Database = require("../models/database");
const database = new Database();
const server = new Server(database);
server.listen();