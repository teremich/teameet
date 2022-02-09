import {Router} from "express";
import * as project from "./project";

export const router = Router();

router.use("/project", project.router);

router.get("/", (req, res, next) => {
    next();
})
