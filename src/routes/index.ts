import {Router, Request, Response, NextFunction} from "express";
import * as api from "./api"
// import {requireAuth, level} from "../middleware/auth"
import {getUser, setUser} from "../controllers/auth"

export const router = Router();

router.use("/api", api.router);

router.all("/", (req: Request, res: Response) => {
    getUser(req.cookies["AuthToken"]).then((userId: number | null ) => {
        if (userId !== null && userId == 4791234) {
            res.status(200);
            res.send("Du bist es!");
        } else {
            setUser(4791234).then((token: string) => {
                getUser(token).then(console.log);
                res.cookie("AuthToken", token);
                res.status(200);
                res.send("OK");
            });
        }
    });
});