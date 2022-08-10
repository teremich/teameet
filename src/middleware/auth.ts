"use strict";
import { getUserLevel, level, _401, _403 } from "../controllers/auth";
import type { Request, RequestHandler, Response, NextFunction, } from "express-serve-static-core";
export { level };
export function requireAuth(lvl: level, projectId: number | undefined = undefined): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction): any | void {
        getUserLevel(
            req.cookies["AuthToken"],
            projectId || Number.parseInt(req.query?.["project"]?.toString() ?? "")
        ).then(user => {
            if (user.uuid) {
                if (lvl > user.level) {
                    _403(res);
                    return;
                }
                (<any>req).userid = user.uuid;
                (<any>req).projectid = projectId;
                return next();
            }
            _401(res);
            return;
        });
    }
}
