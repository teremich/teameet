"use strict";
import express from "express";
import { router } from "routes";
import CookieParser from "cookie-parser";
// @ts-ignore
import * as bodyParserErrorHandler from "express-body-parser-error-handler";

export class Server {
    app: express.Express;
    PORT: string | undefined;
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
    }
    async middleware() {
        if (process.env.NODE_ENV == "dev") {
            console.log("cors is used (bad, only allowed in dev)");
            this.app.use((await import("cors")).default());
        }
        this.app.use(CookieParser());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json({ limit: "10kb" }));
        this.app.use(bodyParserErrorHandler.default());
    }
    routes() {
        this.app.use("/", router);
    }
    async start() {
        if (!this.PORT) {
            console.error("PORT NOT DEFINED");
            process.exit(1);
        }
        await this.middleware();
        this.routes();
        this.app.listen(this.PORT, () => {
            if (process.env.NODE_ENV == "dev") {
                console.info(`listening on port ${this.PORT}\nhttp://teameet.localhost:${this.PORT}`);
            }
        });
    }
}
