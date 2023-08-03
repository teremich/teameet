import { Router } from "express";
import type { Request } from "express";
import { getProjects, postProject, deleteProject, leave } from "controllers/database";
import { getUserLevel } from "controllers/auth";
import { requireAuth, level } from "middleware/auth";
// import type Prisma.JsonObject as JsonObject from "@prisma/client";

export const router = Router();

router.route("/project")
    .get((req, res) => {
        const id = Number.parseInt(req.query["id"]?.toString() ?? "");
        getProjects({ id: id || undefined, take: 1 }).then(async projects => {
            projects.sort((a, b) => {
                if ((<any>a.additional)?.pinned && !(<any>b.additional)?.pinned) {
                    return -1;
                } else if (!(<any>a.additional)?.pinned && (<any>b.additional)?.pinned) {
                    return 1;
                }
                return a.createdAt.getTime() - b.createdAt.getTime();
            });
            if ((await getUserLevel(req.cookies?.["AuthToken"], id)).level < level.OWNER) {
                // public information
                projects = projects.map(p => {
                    if (p.additional) {
                        (<any>p.additional).private! = {}
                    }
                    return {
                        id: p.id,
                        additional: p.additional,
                        description: p.description,
                        name: p.name,
                        details: p.details,
                        createdAt: p.createdAt,
                        owner: p.owner,
                        members: p.members,
                    }
                });
            }
            res.status(200);
            res.json({
                projects
            });
        });
    })
    .post(requireAuth(level.LOGGED_IN), async (req: Request & { userid?: number }, res) => {
        const b = { description: <string>req.body.description, name: <string>req.body.name, ownerId: req.userid ?? 0 };
        if (!b.description?.trim() || !b.name?.trim() || !b.ownerId) {
            res.sendStatus(400);
            return;
        }
        if (b.name.length > 255) {
            res.status(413);
            res.json({
                msg: "the name of the project can only be up to 255 characters"
            });
            return;
        }
        const id = await postProject(b);
        if (!id) {
            res.status(403);
            res.json({
                msg: "there was an error with the database. you probably have already created too many projects"
            });
            return;
        }
        res.status(201);
        res.json({ id });
    })
    .delete(
        (req, res, next) => {
            requireAuth(
                level.OWNER,
                Number.parseInt(req.query["id"]?.toString() ?? "")
            )(req, res, next)
        }, (req: Request & { projectid?: number }, res) => {
            deleteProject(req.projectid ?? 0);
            res.sendStatus(200);
        }
    )
    .search(async (req: Request, res) => {
        const id = Number.parseInt(req.query["id"]?.toString() ?? "");
        getProjects({ id: id || undefined, skip: req.body.skip, take: req.body.take }).then(async projects => {
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
                projects
            });
        });
    });