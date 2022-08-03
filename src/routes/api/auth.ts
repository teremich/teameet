import { Router } from "express";
import { getUserId, getCredsFromReq, login, register, getUserObject } from "../../controllers/auth";
import { statusCode } from "../../controllers/database";
export const router = Router();

router.route("/login")
    // sets a variable if user is already logged in
    .all((req, res, next) => {
        getUserId(req.cookies["AuthToken"]).then(id => {
            // if user is logged in useruuid is not null
            (req as any)["useruuid"] = id;
            next();
        });
    })
    // returns whether you're already loggeed in
    .get((req, res) => {
        if ((req as any)["useruuid"] !== null) {
            getUserObject((req as any)["useruuid"]).then(user => {
                res.json({ status: 200, body: user });
            });
        } else {
            res.json({ status: 401 })
        }
    })
    // logs you in
    .post((req, res) => {
        // if logged in send current user id
        if ((req as any)["useruuid"] !== null) {
            res.json({
                status: 200,
                body: {
                    id: (req as any)["useruuid"]
                }
            });
        } else {
            getCredsFromReq(req).then(creds => {
                // if credentials are wrong
                if (creds == null) {
                    res.json({
                        status: 400,
                        body: {
                            msg: "wrong credentials"
                        }
                    });
                } else {
                    login(creds.email, creds.password).then(loginRes => {
                        if (loginRes === null) {
                            res.json({
                                status: 400,
                                body: {
                                    msg: "no user with that credentials"
                                }
                            });
                        } else {
                            res.cookie("AuthToken", loginRes.token, { maxAge: 0x2932e00/*12 Hours*/ });
                            res.json({
                                status: 200,
                                body: {
                                    id: loginRes.uuid
                                }
                            });
                        }
                    });
                }
            });
        }
    });
// TODO: spam protection
router.post("/register", (req, res) => {
    getUserId(req.cookies["AuthToken"]).then(async r => {
        // if logged in send current user id
        if (r !== null) {
            res.json({
                status: 200,
                body: {
                    id: r
                }
            });
            return;
        }
        const creds = await getCredsFromReq(req);
        // if credentials are wrong
        if (creds == null) {
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
                res.json({ msg: "this email is already registered" });
                break;
            case statusCode.ERROR_NAME_TOO_LONG:
                res.status(400);
                res.json({ msg: "your name is too long" });
                break;
            case statusCode.SUCCESS:
                res.cookie("AuthToken", regRes.token);
                res.status(200);
                res.json({ msg: regRes.token });
                break;
            default:
                console.error(regRes);
                res.status(500);
                res.json({ msg: "internal server error" });
        }
    });
});
