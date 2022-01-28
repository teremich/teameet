require('dotenv').config();
const Server = require('../models/server');
const Database = require("../models/database");
const database = new Database.Database();
const server = new Server(database);
server.listen();