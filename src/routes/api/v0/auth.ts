import { Router } from "express";
import {
    getUserId,
    getCredsFromLoginReq,
    getCredsFromRegisterReq,
    login, logout,
    register, deleteUser,
    getUserObject
} from "controllers/auth";
import { statusCode } from "controllers/database";
import type { Request } from "express";
export const router = Router();

// TODO: github social login
// moved to post v1.0
router.all("/githublogin", (req, res) => {
    console.log(req);
    console.log(req.body);
    res.sendStatus(200);
});

router.route("/login")
    // sets a variable if user is already logged in
    .all((req: Request & { "useruuid"?: number | null }, res, next) => {
        getUserId(req.cookies["AuthToken"]).then(id => {
            // if user is logged in useruuid is not null
            req["useruuid"] = id;
            next();
        });
    })
    // returns whether you're already loggeed in
    .get((req: Request & { "useruuid"?: number | null }, res) => {
        if (req["useruuid"]) {
            getUserObject(req["useruuid"]).then(user => {
                res.status(200);
                res.json(user);
            });
        } else {
            // user gets an error in the console if this is status 401
            res.status(401);
            res.json({
                msg: "you are not logged in"
            })
        }
    })
    // logs you in
    .post((req: Request & { "useruuid"?: number | null }, res) => {
        // if logged in send current user id
        if (req["useruuid"]) {
            res.status(200);
            res.json({
                id: req["useruuid"]
            });
            return;
        }
        getCredsFromLoginReq(req).then(creds => {
            // if credentials are wrong
            if (creds == null) {
                res.status(400);
                res.json({
                    msg: "wrong credentials"
                });
                return;
            }
            login(creds.email, creds.password).then(loginRes => {
                if (loginRes === null) {
                    res.status(400);
                    res.json({
                        msg: "no user with that credentials"
                    });
                    return;
                }
                res.cookie("AuthToken", loginRes.token, { maxAge: 0x2932e00/*12 Hours*/ });
                res.status(200);
                res.json({
                    id: loginRes.uuid
                });
            });
        });
    }).delete((req, res) => {
        logout(req.cookies["AuthToken"]);
        res.sendStatus(200);
    });

// TODO: spam protection (optional feature, moved to post 1.0)
// idea: maybe by allowing github registration only
router.route("/register").post((req, res) => {
    getUserId(req.cookies["AuthToken"]).then(async r => {
        // if logged in send current user id
        if (r !== null) {
            res.status(200);
            res.json({id: r});
            return;
        }
        const creds = await getCredsFromRegisterReq(req);
        if (creds == null) {
            res.status(400);
            res.json({
                msg: "wrong credentials"
            });
            return;
        }
        const regRes = await register({ email: creds.email, password: creds.password, bio: {}, name: creds.name });
        switch (regRes.code) {
            case statusCode.ERROR_DUPLICATE_EMAIL:
                res.status(400);
                res.json({ msg: "this email is already registered"});
                break;
            case statusCode.ERROR_NAME_TOO_LONG:
                res.status(400);
                res.json({ msg: "your name is too long" });
                break;
            case statusCode.SUCCESS:
                res.cookie("AuthToken", regRes.token, { maxAge: 0x2932e00/*12 Hours*/ });
                res.status(201);
                res.json({
                    msg: "successfully registered"
                });
                break;
            default:
                console.error(regRes);
                res.status(500);
                res.json({ msg: "internal server error" });
        }
    });
}).delete(async (req, res) => {
    getUserId(req.cookies["AuthToken"]).then(async r => {
        if (await deleteUser(r ?? 0)) {
            logout(req.cookies["AuthToken"]);
            res.clearCookie("AuthToken");
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    });
});
