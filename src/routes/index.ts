import {Router, Request, Response, NextFunction} from "express";
import * as api from "./api"
import {requireAuth, level} from "../middleware/auth"
import {normalize} from "path";
import { _401, login, getUserObject, getUserId } from "../controllers/auth";

export const router = Router();

router.use("/api", requireAuth(level.ADMIN), api.router);

router.all("/", (req: Request, res: Response) => {
    getUserId(req.cookies?.["AuthToken"]).then(id => {
        if (id == 1461812410) {
            getUserObject(id).then(user => {
                res.send("oh! it's you! " + user.name);
            });
        } else {
            res.sendFile(normalize(__dirname+"../../../public/index.html"));
        }
    });
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    const mail = req.body?.email?.toString();
    const pw = req.body?.password?.toString();
    login(mail || "", pw || "").then(token => {
        if (token === null) {
            _401(res);
        } else {
            res.cookie("AuthToken", token);
            res.status(200);
            res.send("logged in");
        }
    });
});
