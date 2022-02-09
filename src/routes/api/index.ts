import {Router, Request, Response, NextFunction} from "express";
import { requireAuth, level } from "../../middleware/auth";
import {getProjects} from "../../controllers/database"
import * as auth from "./auth"

export const router = Router();

// /login /register
router.use(auth.router);

router.route("/")
    .all(requireAuth(level.ADMIN))
    .get((req: Request, res: Response) => {
        res.send("get api");
    })
    .post((req: Request, res: Response) => {
        res.send("post api");
    })
    .put((req: Request, res: Response) => {
        res.send("put api");
    })
    .delete((req: Request, res: Response) => {
        res.send("delete api");
    });

router.get("/projects", (req, res) => {
    getProjects().then(projects => {
        res.json({
            status: 200,
            body: {
                projects
            }
        });
    });
});
