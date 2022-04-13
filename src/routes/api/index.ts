import {Router, Request, Response, NextFunction} from "express";
import { requireAuth, level } from "../../middleware/auth";
import {getProjects, postProject} from "../../controllers/database"
import * as auth from "./auth"
import { getUserId } from "../../controllers/auth";

export const router = Router();

// /login /register
router.use(auth.router);

function assert(...assumptions: boolean[]) {
    for (let i = 0; i < assumptions.length; i++) {
        if (!assumptions[i]) {
            console.error(`assertion ${i} failed`);
            return true;
        }
    }
    return false;
}

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

router.route("/project").get((req, res) => {
    const ids = req.query["id"];
    let idn: number | undefined;
    if (ids instanceof String) {
        idn = Number.parseInt(<string>ids);
    }
    getProjects({id: idn}).then(projects => {
        res.json({
            status: 200,
            body: {
                projects
            }
        });
    });
}).post((req, res) => {
    const b = req.body?.data;
    if (assert(b, b.hasOwnProperty("description"), b.hasOwnProperty("name"), b.hasOwnProperty("ownerId"), !!Number.parseInt(b.ownerId))) {
        res.sendStatus(400);
        return;
    }
    getUserId(req.cookies["AuthToken"]).then(id => {
        if (assert(id == Number.parseInt(b.ownerId))) {
            res.sendStatus(401);
            return;
        }
        postProject(b);
        res.send("request to make project was made");
    });
}).delete((req, res) => {
});
