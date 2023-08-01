import { Router } from "express";
import { level, requireAuth } from "middleware/auth";
import {
    getJoinRequestsByProject,
    getJoinRequestsByUser,
    makeJoinRequest,
    addMember,
    deleteJoinRequest
} from "controllers/database";
import type { Request } from "express";
import { getUserId, getUserLevel, _403 } from "controllers/auth";

export const router = Router();

router.route("/join") // ?project=id&user=uuid
    .get(async (req, res) => {
        const projectId = Number.parseInt(req.query["project"]?.toString() ?? "");
        if (projectId) {
            const { uuid: userid, level: userLevel } = await getUserLevel(req.cookies["AuthToken"], projectId);
            // explicit permissions who is allowed to see join requests
            if (userLevel & level.MEMBER || userLevel & level.OWNER || userLevel & level.ADMIN) {
                const joinRequests = await getJoinRequestsByProject(projectId);
                res.status(200);
                res.json({
                    userid,
                    projectId,
                    joinRequests
                });
            } else {
                _403(res);
            }
        } else {
            const userid = await getUserId(req.cookies["AuthToken"]) ?? 0;
            const jrs = await getJoinRequestsByUser(userid);
            res.status(200);
            res.json({
                userid,
                joinRequests: jrs
            });
        }
    })
    .post(requireAuth(level.LOGGED_IN), async (req: Request & { userid?: number }, res) => {
        const userid = req.userid;
        const projectid = Number.parseInt(req.query["project"]?.toString() ?? "");
        if (!userid || !projectid || !(req.body.message?.trim())) {
            res.status(400);
            res.json({
                msg: "wrong parameters"
            });
            return;
        }
        if (await makeJoinRequest(
            userid,
            projectid,
            req.body.message.trim()
        )) {
            res.status(201);
            res.json({
                userid,
                projectid
            });
        } else {
            res.status(400);
            res.json({
                msg: "you already sent a join request"
            });
        }
    }).delete(async (req, res) => {
        const projectId = Number.parseInt(req.query["project"]?.toString() ?? "");
        if (!projectId) {
            res.status(400);
            res.json({
                msg: "you are trying to delete a joinRequest but you don't specify a project"
            });
            return;
        }
        const { uuid: userid, level: userLevel } = await getUserLevel(req.cookies["AuthToken"], projectId);
        const senderId = Number.parseInt(req.query["user"]?.toString() ?? "");
        if (!senderId) {
            res.status(400);
            res.json({
                msg: "no `user` specified"
            });
            return;
        }
        if (senderId != userid && !(userLevel & level.OWNER || userLevel & level.ADMIN)) {
            _403(res);
            return;
        }
        if (senderId != userid) {
            if (req.query["accepted"] && (req.query["accepted"] == "1" || req.query["accepted"] == "true")) {
                await addMember(senderId, projectId);
            }
        }
        await deleteJoinRequest(senderId, projectId);
        res.sendStatus(200);
    });