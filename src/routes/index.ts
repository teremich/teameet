import {Router, Request, Response} from "express";
import * as express from "express";
import * as api from "./api"
import * as project from "./project"
import {BUILD_ROUTE} from "../controllers/auth";

export const router = Router();

router.use("/api", api.router);

router.use("/project", project.router);

router.use(express.static(BUILD_ROUTE));
// router.all("/", (req: Request, res: Response) => {
//     res.sendFile(BUILD_ROUTE + "/index.html");
// });
