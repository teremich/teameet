import { Router } from "express";
import type { Request } from "express";
import { _401, level, getUserId, getUserLevel, getUserObject } from "controllers/auth";
import { getProjects, updateUser } from "controllers/database";
export const router = Router();

interface Project {
    id: number;
    ownerId: number;
    name: string;
    description: string;
    createdAt: Date;
    additional: any | null;
}

interface publicInfo {
    uuid: number;
    name: string;
    ownerOf: Project[];
    memberOf: Project[];
    bio: any;
    additional: any | null;
}

interface privateInfo extends publicInfo {
    email: string;
    createdAt: Date;
    joins: {
        additional: any;
        createdAt: Date;
        message: string;
        receiver: Project;
    }[];
}

async function asyncmap<T, U>(list: Iterable<T>, callback: (item: T) => Promise<U>): Promise<U[]> {
    let newlist: U[] = [];
    for (const item of list) {
        newlist.push(await callback(item));
    }
    return newlist;
}

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
        const user = await getUserObject(requestedUserId == req["useruuid"] ? level.OWNER : level.LOGGED_OUT, requestedUserId);
        if (!user) {
            res.status(404);
            res.json({
                msg: "user not found"
            })
            return;
        }
        
    }).patch(async (req: Request & { "useruuid"?: number }, res) => {
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
