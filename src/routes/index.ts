import {Router, Request, Response} from "express";
import * as api from "./api"
import * as project from "./project"
import {BUILD_ROUTE} from "../controllers/auth";
import auth from "./auth"

export const router = Router();

router.use(auth);
router.all("/", (req: Request, res: Response) => {
    res.sendFile(BUILD_ROUTE + "/index.html");
});

router.use("/api", api.router);

router.use("/project", project.router);
