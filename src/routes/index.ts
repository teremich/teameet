import express from "express";
import * as api from "./api";
import { BUILD_ROUTE } from "controllers/views";
import { getUserId } from "models/redis";

export const router = express.Router();
const wwwrouter = express.Router();
wwwrouter.use("*", (req, res, next) => {
    if (req.subdomains.length == 0) {
        res.redirect(301, `http${process.env.NODE_ENV == "dev" ? "" : "s"}://www.${req.headers.host + req.originalUrl}`);
        return;
    }
    next();
});

router.use("/api", api.router);
router.use(wwwrouter);
router.use("/login", (req, res, next) => {
    getUserId(req.cookies["AuthToken"]).then(id => {
        if (id) {
            let referer = decodeURI((<any>req.query)?.["href"]);
            if (referer) {
                res.redirect(referer);
                return;
            }
        }
        next();
    });
});
router.use(express.static(BUILD_ROUTE));
router.use((req, res) => {
    res.sendFile(BUILD_ROUTE + "index.html");
});
