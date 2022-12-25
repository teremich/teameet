"use strict";
import { getUserLevel, level, _401, _403 } from "controllers/auth";
import type { Request, RequestHandler, Response, NextFunction, } from "express-serve-static-core";
export { level };
export function requireAuth(lvl: level, projectId: number | undefined = undefined): RequestHandler {
    return function (req: Request & { userid?: number, projectid?: number }, res: Response, next: NextFunction): any | void {
        getUserLevel(
            req.cookies["AuthToken"],
            projectId ?? NaN
        ).then(user => {
            if (user.uuid) {
                if (lvl & user.level) {
                    _403(res);
                    return;
                }
                req.userid = user.uuid;
                req.projectid = projectId;
                return next();
            }
            _401(res);
            return;
        });
    }
}
