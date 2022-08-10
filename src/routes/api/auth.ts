import { Router } from "express";
import {
    getUserId,
    getCredsFromLoginReq,
    getCredsFromRegisterReq,
    login, logout,
    register, deleteUser,
    getUserObject
} from "../../controllers/auth";
import { statusCode } from "../../controllers/database";
export const router = Router();


router.route("/login")
    // sets a variable if user is already logged in
    .all((req, res, next) => {
        getUserId(req.cookies["AuthToken"]).then(id => {
            // if user is logged in useruuid is not null
            (<any>req)["useruuid"] = id;
            next();
        });
    })
    // returns whether you're already loggeed in
    .get((req, res) => {
        if ((<any>req)["useruuid"] !== null) {
            getUserObject((<any>req)["useruuid"]).then(user => {
                res.status(200);
                res.json({ status: 200, body: user });
            });
        } else {
            // user gets an error in the console if this is status 401
            res.status(200);
            res.json({
                // front end will try to load user info if this is 200
                status: 401, body: {
                    msg: "you are not logged in"
                }
            })
        }
    })
    // logs you in
    .post((req, res) => {
        // if logged in send current user id
        if ((<any>req)["useruuid"] !== null) {
            res.status(200);
            res.json({
                status: 200,
                body: {
                    id: (<any>req)["useruuid"]
                }
            });
            return;
        }
        getCredsFromLoginReq(req).then(creds => {
            // if credentials are wrong
            if (creds == null) {
                res.status(400);
                res.json({
                    status: 400,
                    body: {
                        msg: "wrong credentials"
                    }
                });
                return;
            }
            login(creds.email, creds.password).then(loginRes => {
                if (loginRes === null) {
                    res.status(400);
                    res.json({
                        status: 400,
                        body: {
                            msg: "no user with that credentials"
                        }
                    });
                    return;
                }
                res.cookie("AuthToken", loginRes.token, { maxAge: 0x2932e00/*12 Hours*/ });
                res.status(200);
                res.json({
                    status: 200,
                    body: {
                        id: loginRes.uuid
                    }
                });
            });
        });
    }).delete((req, res) => {
        logout(req.cookies["AuthToken"]);
        res.sendStatus(200);
    });
// TODO: spam protection
router.route("/register").post((req, res) => {
    getUserId(req.cookies["AuthToken"]).then(async r => {
        // if logged in send current user id
        if (r !== null) {
            res.status(200);
            res.json({
                status: 200,
                body: {
                    id: r
                }
            });
            return;
        }
        const creds = await getCredsFromRegisterReq(req);
        if (creds == null) {
            res.status(400);
            res.json({
                status: 400,
                body: {
                    msg: "wrong credentials"
                }
            });
            return;
        }
        const regRes = await register({ email: creds.email, password: creds.password, bio: {}, name: creds.name });
        switch (regRes.code) {
            case statusCode.ERROR_DUPLICATE_EMAIL:
                res.status(400);
                res.json({
                    status: 400,
                    body: { msg: "this email is already registered" }
                });
                break;
            case statusCode.ERROR_NAME_TOO_LONG:
                res.status(400);
                res.json({
                    status: 400,
                    body: { msg: "your name is too long" }
                });
                break;
            case statusCode.SUCCESS:
                res.cookie("AuthToken", regRes.token, { maxAge: 0x2932e00/*12 Hours*/ });
                res.status(201);
                res.json({
                    status: 201, body: {
                        body: { msg: "successfully registered" }
                    }
                });
                break;
            default:
                console.error(regRes);
                res.status(500);
                res.json({
                    status: 500,
                    body: { msg: "internal server error" }
                });
        }
    });
}).delete((req, res) => {
    getUserId(req.cookies["AuthToken"]).then(async r => {
        deleteUser(r ?? 0);
    });
});
