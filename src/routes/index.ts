import {Router, Request, Response} from "express";
import * as express from "express";
import * as api from "./api"
import * as project from "./project"
import {BUILD_ROUTE} from "../controllers/auth";
import * as auth from "./auth"

export const router = Router();

// router.all("/", (req: Request, res: Response) => {
//     res.sendFile(BUILD_ROUTE + "/index.html");
// });

// /login and /register
router.use(auth.router);

router.use("/api", api.router);

router.use("/project", project.router);

router.use(express.static(BUILD_ROUTE));