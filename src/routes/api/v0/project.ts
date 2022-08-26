import { Router } from "express";
import { getProjects, postProject, deleteProject } from "controllers/database";
import { getUserLevel } from "controllers/auth";
import { requireAuth, level } from "middleware/auth";

export const router = Router();

router.route("/project").get((req, res) => {
    const id = Number.parseInt(req.query["id"]?.toString() ?? "");
    getProjects({ id: id || undefined }).then(async projects => {
        projects.sort((a, b) => {
            if ((<any>a.additional)?.pinned && !(<any>b.additional)?.pinned) {
                return -1;
            } else if (!(<any>a.additional)?.pinned && (<any>b.additional)?.pinned) {
                return 1;
            }
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
        if ((await getUserLevel(req.cookies?.["AuthToken"], id)).level < level.MEMBER) {
            // public information
            projects = projects.map(p => ({
                id: p.id,
                additional: p.additional,
                description: p.description,
                name: p.name,
                details: p.details,
                createdAt: p.createdAt,
                owner: p.owner,
                members: p.members,
            }));
        }
        res.status(200);
        res.json({
            status: 200,
            body: {
                projects
            }
        });
    });
}).post(requireAuth(level.LOGGED_IN), async (req, res) => {
    const b = { description: <string>req.body.description, name: <string>req.body.name, ownerId: <number>(<any>req).userid };
    if (!b.description?.trim() || !b.name?.trim() || !b.ownerId) {
        res.sendStatus(400);
        return;
    }
    const id = await postProject(b);
    if (!id) {
        res.status(200);
        res.json({
            status: 403,
            body: {
                msg: "you have already created too many projects"
            }
        });
    }
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