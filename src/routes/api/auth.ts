import { Router } from "express";
import { getUserId, getCredsFromLoginReq, getCredsFromRegisterReq, login, register, getUserObject } from "../../controllers/auth";
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
                res.json({ status: 200, body: user });
            });
        } else {
            res.json({ status: 401 })
        }
    })
    // logs you in
    .post((req, res) => {
        // if logged in send current user id
        if ((<any>req)["useruuid"] !== null) {
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
                    res.json({
                        status: 400,
                        body: {
                            msg: "no user with that credentials"
                        }
                    });
                    return;
                }
                res.cookie("AuthToken", loginRes.token, { maxAge: 0x2932e00/*12 Hours*/ });
                res.json({
                    status: 200,
                    body: {
                        id: loginRes.uuid
                    }
                });
            });
        });
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
        const creds = await getCredsFromRegisterReq(req);
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
                res.json({
                    status: 400,
                    msg: "this email is already registered"
                });
                break;
            case statusCode.ERROR_NAME_TOO_LONG:
                res.json({
                    status: 400,
                    msg: "your name is too long"
                });
                break;
            case statusCode.SUCCESS:
                res.cookie("AuthToken", regRes.token, { maxAge: 0x2932e00/*12 Hours*/ });
                res.json({ status: 201 });
                break;
            default:
                console.error(regRes);
                res.json({
                    status: 500,
                    msg: "internal server error"
                });
        }
    });
});
