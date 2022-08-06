import { Router, Request, Response, NextFunction } from "express";
import { requireAuth, level } from "../../middleware/auth";
import { getProjectsPublic, postProject } from "../../controllers/database"
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
    const id = Number.parseInt(req.query["id"]?.toString() ?? "");
    getProjectsPublic({ id: id ? id : undefined }).then(projects => {
        res.json({
            status: 200,
            body: {
                projects
            }
        });
    });
}).post(requireAuth(level.LOGGED_IN), async (req, res) => {
    const b = { description: <string>req.body.description, name: <string>req.body.name, ownerId: <number>(<any>req).userid };
    if (assert(!!b.description.trim(), !!b.name.trim(), !!b.ownerId)) {
        res.sendStatus(400);
        return;
    }
    const id = await postProject(b);
    res.json({ status: 201, id });
}).delete((req, res) => {
});
