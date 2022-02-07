import {Router, Request, Response, NextFunction} from "express";
import * as api from "./api"
import * as project from "./project"
import {requireAuth, level} from "../middleware/auth"
import {normalize} from "path";
import { _401, login, getUserObject, getUserId } from "../controllers/auth";

export const router = Router();

router.use("/api", api.router);

router.all("/", (req: Request, res: Response) => {
    res.sendFile(normalize(__dirname + "../../../public/build/index.html"));
});

router.use("/project", project.router);

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    const mail = req.body?.email?.toString();
    const pw = req.body?.password?.toString();
    login(mail || "", pw || "").then(token => {
        if (token === null) {
            // Unauthorized
            _401(res); // TODO: make response better
        } else {
            res.cookie("AuthToken", token);
            res.status(200);
            res.send("logged in");
        }
    });
});
