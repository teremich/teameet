const {Router} = require("express");
const {getUserId, getCredsFromReq, login, register} = require("../controllers/auth");
const router = Router();

router.route("/login")
    .all((req, res, next) => {
        getUserId(req.cookies["AuthToken"]).then(id => {
            req.useruuid = id;
            next();
        });
    })
    .get((req, res) => {
        if (req.useruuid !== null) {
            res.json({status: 200, body: {id: req.useruuid}});
        } else {
            res.json({status: 401})
        }
    })
    .post((req, res) => {
        // if logged in
        if (req.useruuid !== null) {
            res.json({
                status:200,
                body: {
                    id: req.useruuid
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
                            res.cookie("AuthToken", loginRes.token);
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
// TODO
router.post("/register", (req, res) => {
    getUserId(req.cookies["AuthToken"]).then(r => {
        // if logged in
        if (r !== null) {
            res.json({
                status:200,
                body: {
                    id: r
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
                    })
                } else {
                    register({email: creds.email, password: creds.password, bio: {}, name: creds.name}).then(regRes => {
                        switch(regRes.code) {
                            case statusCode.ERROR_DUPLICATE_EMAIL:
                                res.statusCode(400);
                                res.json({msg: "this email is already registered"});
                                break;
                            case statusCode.ERROR_NAME_TOO_LONG:
                                res.statusCode(400);
                                res.json({msg: "your name is too long"});
                                break;
                            case statusCode.SUCCESS:
                                res.cookie("AuthToken", regRes.token);
                                res.statusCode(200);
                                res.json({msg: regRes.token});
                                break;
                            default:
                                console.error(regRes);
                                res.statusCode(500);
                                res.json({msg: "internal server error"});
                        }
                    });
                }
            });
        }
    });
});

module.exports = {router};
