import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth, level } from "middleware/auth";

import * as auth from "./auth";
import * as profile from "./profile";
import * as project from "./project";
import * as join from "./join";
import * as leave from "./leave";

export const router = Router();

// /login /register
router.use(auth.router);
// /profile
router.use(profile.router);
// /project
router.use(project.router);
// /join
router.use(join.router);
// /leave
router.use(leave.router);

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


