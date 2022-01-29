"use strict";
require('dotenv').config();
import Server from '../modules/server';
import Database from "../modules/database";
const database = new Database.Database();
const server = new Server(database);
server.listen();