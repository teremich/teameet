import {Router, Request, Response, NextFunction} from "express";
import { requireAuth, level } from "../../middleware/auth";
import {getCredsFromReq, getUserId, login} from "../../controllers/auth"

export const router = Router();

router.route("/")
    .all(requireAuth(level.ADMIN))
    .get((req: Request, res: Response) => {
        res.send("get api");
    })
    .post((req: Request, res: Response) => {
        res.send("post api");
    })
    .put((req: Request, res: Response) => {
        res.send("put api");
    })
    .delete((req: Request, res: Response) => {
        res.send("delete api");
    });

router.get("/projects", (req, res) => {
    res.send({
        status: 200,
        body: {
            projects: [
                {id: 0, name: "name1", owner:"admin", description: "A", languages: "nodejs"},
                {id: 1, name: "name2", owner:"teremich", description: "B", languages: ""},
                {id: 2, name: "name3", owner:"blixary", description: "C", languages: "Python 3.10"}
            ]
        }
    });
});

router.post("/login", (req, res) => {
    getUserId(req.cookies["AuthToken"]).then(r => {
        // if logged in
        if (r !== null) {
            res.send({
                status:200,
                body: {
                    id: r
                }
            });
        } else {
            getCredsFromReq(req).then(creds => {
                // if credentials are wrong
                if (creds == null) {
                    res.send({
                        status: 400,
                        body: {
                            msg: "wrong credentials"
                        }
                    })
                } else {
                    login(creds.email, creds.password).then(loginRes => {
                        if (loginRes === null) {
                            res.send({
                                status: 400,
                                body: {
                                    msg: "no user with that credentials"
                                }
                            });
                        } else {
                            res.cookie("AuthToken", loginRes.token);
                            res.send({
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
});
// TODO
router.post("/register", (req, res) => {
    getUserId(req.cookies["AuthToken"]).then(r => {
        // if logged in
        if (r !== null) {
            res.send({
                status:200,
                body: {
                    id: r
                }
            });
        } else {
            getCredsFromReq(req).then(creds => {
                // if credentials are wrong
                if (creds == null) {
                    res.send({
                        status: 400,
                        body: {
                            msg: "wrong credentials"
                        }
                    })
                } else {
                    login(creds.email, creds.password).then(loginRes => {
                        if (loginRes === null) {
                            res.send({
                                status: 400,
                                body: {
                                    msg: "no user with that credentials"
                                }
                            });
                        } else {
                            res.cookie("AuthToken", loginRes.token);
                            res.send({
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
});
