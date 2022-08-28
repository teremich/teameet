import { Router } from "express";
import type { Request } from "express";
import { level, requireAuth } from "middleware/auth";
import { leave } from "controllers/database";

export const router = Router();

router.post("/leave", // ?project=id&user=uuid&ban=boolean
    requireAuth(level.LOGGED_IN), async (req: Request & { userid?: number }, res) => {
        const leaveInitiator = req.userid as number;
        const leavingUser = Number.parseInt(req.query["user"]?.toString() ?? "") || leaveInitiator;
        const projectId = Number.parseInt(req.query["project"]?.toString() ?? "");
        const ban = !!["1", "true"].find(r => r == req.query["ban"]);
        if (!projectId || !leavingUser) {
            res.status(200);
            res.json({
                status: 400,
                body: {
                    msg: "please make sure to supply a project id"
                }
            });
            return;
        }
        if (await leave({
            ban,
            projectId,
            leavingUser,
            leaveInitiator,
            message: (req.body.message as string | undefined)?.trim()
        })) {
            res.sendStatus(200);
        } else {
            res.status(400);
            res.json({
                status: 400,
                body: {
                    msg: "something went wrong"
                }
            });
        }
    });