import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth, level } from "../../middleware/auth";
import { getProjectsPublic, postProject, deleteProject } from "../../controllers/database";
import * as auth from "./auth";
import * as profile from "./profile";

export const router = Router();

// /login /register
router.use(auth.router);
// /profile
router.use(profile.router);

// TODO: seperate /profile into its own file
// TODO: add join request feature

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
        res.status(200);
        res.json({
            status: 200,
            body: {
                projects
            }
        });
    });
}).post(requireAuth(level.LOGGED_IN), async (req, res) => {
    // TODO: spam protection
    // idea: only one project per user per day
    const b = { description: <string>req.body.description, name: <string>req.body.name, ownerId: <number>(<any>req).userid };
    if (!b.description?.trim() || !b.name?.trim() || !b.ownerId) {
        res.sendStatus(400);
        return;
    }
    const id = await postProject(b);
    res.status(201);
    res.json({ status: 201, id });
}).delete(
    (req, res, next) => {
        requireAuth(
            level.OWNER,
            Number.parseInt(req.query["id"]?.toString() ?? "")
        )(req, res, next)
    }, (req, res) => {
        deleteProject((<any>req).projectid);
        res.sendStatus(200);
    }
);
