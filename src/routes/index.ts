import { Router } from "express";
import * as express from "express";
import * as api from "./api"
import { BUILD_ROUTE } from "../controllers/views"
import { getUserId } from "../models/redis";
import { requireAuth, level } from "../middleware/auth";

export const router = Router();
router.use("/login", (req, res, next) => {
    getUserId(req.cookies["AuthToken"]).then(id => {
        if (id) {
            let referer = decodeURI((<any>req.query)?.["ref"]);
            if (referer) {
                res.redirect(referer);
                return;
            }
        }
        next();
    });
});
router.use("/api", api.router);
router.use(express.static(BUILD_ROUTE));
