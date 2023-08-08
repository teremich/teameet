import { Router } from "express";
import type { Request } from "express";
import { _401, level, getUserId, getUserObject } from "controllers/auth";
import { updateUser } from "controllers/database";
export const router = Router();

router.route("/profile")
    // sets a variable if user is already logged in
    .all((req: Request & { "useruuid"?: number | null }, res, next) => {
        getUserId(req.cookies["AuthToken"]).then(id => {
            // if user is logged in useruuid is not null
            req["useruuid"] = id;
            next();
        });
    })
    .get(async (req: Request & { "useruuid"?: number }, res) => {
        const requestedUserId = Number.parseInt(req.query["id"]?.toString() ?? "");
        const ownInfo = requestedUserId == req["useruuid"];
        const user = await getUserObject(ownInfo ? level.OWNER : level.LOGGED_OUT, requestedUserId);
        if (!user) {
            res.status(404);
            res.json({
                msg: "user not found"
            })
            return;
        }
        res.status(200);
        res.json({ownInfo, payload: user});
    })
    .patch(async (req: Request & { "useruuid"?: number }, res) => {
        // TODO:
        // start with the api documentation,
        // then implement a database controller function like `updateUser`,
        // then pass suitable arguments from here to the new function
        // updateable field are bio, name, password, email, additional
        if (!req["useruuid"]) {
            _401(res);
            return;
        }
        updateUser(req["useruuid"], {
            bio: req.body.bio,
            name: <string>req.body.name,
            password: <string>req.body.password,
            additional: req.body.additional
        });
        res.status(200);
        res.json({
            uuid: req["useruuid"]
        });
    });
