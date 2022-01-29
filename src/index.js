"use strict";
require('dotenv').config();
const Server = require('../modules/server');
const Database = require("../modules/database");
const database = new Database.Database();
const server = new Server(database);
server.listen();