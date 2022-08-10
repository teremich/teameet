"use strict";
require("dotenv").config();
import express from "express";
import { router } from "../routes";
import CookieParser from "cookie-parser";
import cors from "cors";
// @ts-ignore
import * as bodyParserErrorHandler from "express-body-parser-error-handler";

export class Server {
    app: express.Express;
    PORT: string | undefined;
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
    }
    middleware() {
        this.app.use(CookieParser());
        if (process.env.NODE_ENV == "dev") { this.app.use(cors({ origin: "http://*localhost:8080" })); }
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json({ limit: "10kb" }));
        this.app.use(bodyParserErrorHandler.default());
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
