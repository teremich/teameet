"use strict";
require("dotenv").config();
import express from "express";
import {router} from "../routes";
import CookieParser from "cookie-parser";
import {normalize} from "path";

export class Server{
    app: express.Express;
    PORT: string | undefined;
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
    }
    middleware() {
        this.app.use(CookieParser());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
    }
    routes() {
        this.app.use("/", router);
    }
    start() {
        this.middleware();
        this.routes();
        if (!this.PORT) {
            console.error("PORT NOT DEFINED");
            process.exit(1);
        }
        this.app.listen(this.PORT, () => {
            console.info(`listening on port http://teameet.localhost:${this.PORT}`);
        });
    }
}
