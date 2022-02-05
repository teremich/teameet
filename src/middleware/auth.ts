"use strict";
import {getUserLevel, level, _401, _403} from "../controllers/auth";
import {Request,  RequestHandler,  Response, NextFunction, } from "express-serve-static-core";
export {level};
export function requireAuth(lvl: level): RequestHandler {
    return function(req: Request, res: Response, next: NextFunction): any | void {
        getUserLevel(req.cookies["AuthToken"], req.query["project"]?.toString()).then( userLevel => {
            if (lvl > userLevel) {
                if (userLevel) {
                    _401(res);
                } else {
                    _403(res);
                }
            }
            return next();
        });
    }
}
