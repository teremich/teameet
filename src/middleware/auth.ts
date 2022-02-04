"use strict";
import {getUserLevel, level, _401, _403} from "../controllers/auth";
import {Request,  RequestHandler,  Response, NextFunction, } from "express-serve-static-core";
export {level};
export function requireAuth(lvl: level): RequestHandler {
    return function(req: Request, res: Response, next: NextFunction): any | void {
        console.log(req, req.cookies, "if req.cookies is undefinded please remove requireAuth function");
        getUserLevel(req.cookies["userToken"], req.query["project"]?.toString()).then( userLevel => {
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