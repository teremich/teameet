"use strict";
require("dotenv").config();
import { Server } from "models/server"
const s = new Server();
s.start();
